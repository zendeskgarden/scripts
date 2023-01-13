/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { siteId as getSiteId, token as getToken } from '../index.js';
import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Ora } from 'ora';
import { execa } from 'execa';

interface INetlifyDeployArgs {
  dir: string;
  production?: boolean;
  token?: string;
  siteId?: string;
  message?: string;
  spinner?: Ora;
}

type RETVAL = {
  url: string;
  logUrl: string;
};

/**
 * Execute the `netlify-deploy` command.
 *
 * @param {string} args.dir Folder to deploy.
 * @param {boolean} [args.production] Determine whether this is a production deploy.
 * @param {string} [args.message] Deploy message.
 * @param {string} [args.token] Netlify personal access token.
 * @param {string} [args.siteId] Netlify site API ID.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {object} The Netlify deployment and log URLs.
 */
export const execute = async (args: INetlifyDeployArgs): Promise<RETVAL | undefined> => {
  let retVal: RETVAL | undefined;

  try {
    const siteId = args.siteId || (await getSiteId(args.spinner));
    const token = args.token || (await getToken(args.spinner));
    const deployArgs = [
      'deploy',
      `--site=${siteId}`,
      `--auth=${token}`,
      `--dir=${args.dir}`,
      '--json'
    ];

    if (args.production) {
      deployArgs.push('--prod');
    }

    if (args.message) {
      deployArgs.push(`--message=${args.message}`);
    }

    /* https://cli.netlify.com/commands/deploy */
    const deploy = await execa('netlify', deployArgs, { preferLocal: true });

    const response = JSON.parse(deploy.stdout);
    const url = args.production ? response.url : response.deploy_url;

    retVal = { url, logUrl: response.logs };
  } catch (error: unknown) {
    handleErrorMessage(error, 'netlify-deploy', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('netlify-deploy');

  return command
    .description('deploy to a Netlify site')
    .argument('<dir>', 'directory of content to deploy')
    .option('-p, --production', 'production deploy')
    .option('-i, --id <id>', 'site API ID')
    .option('-t, --token <token>', 'access token')
    .option('-m, --message <message>', 'deploy message')
    .action(async dir => {
      try {
        spinner.start();

        const options = command.opts();
        const result = await execute({
          dir,
          production: options.production,
          token: options.token,
          siteId: options.id,
          message: options.message,
          spinner
        });

        if (result) {
          handleSuccessMessage(result.url, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail(`Unable to deploy ${dir}`);
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
