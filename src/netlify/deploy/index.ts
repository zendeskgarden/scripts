/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { siteId as getSiteId, token as getToken } from '..';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import NetlifyAPI from 'netlify';
import { Ora } from 'ora';

type ARGS = {
  dir: string;
  production: boolean;
  token?: string;
  siteId?: string;
  message?: string;
  spinner?: Ora;
};

type RETVAL = {
  url: string;
  logUrl: string;
};

/**
 * Execute the `netlify-deploy` command.
 *
 * @param {string} args.dir Folder to deploy.
 * @param {string} args.production Determine whether this is a production deploy.
 * @param {string} [args.message] Deploy message.
 * @param {string} [args.token] Netlify personal access token.
 * @param {string} [args.siteId] Netlify site API ID.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {object} The Netlify deployment and log URLs.
 */
export const execute = async (
  args: ARGS = { dir: '', production: false }
): Promise<RETVAL | undefined> => {
  let retVal: RETVAL | undefined;

  try {
    const token = args.token || (await getToken(args.spinner));
    const client = new NetlifyAPI(token);
    const siteId = args.siteId || (await getSiteId(args.spinner));

    /* https://open-api.netlify.com/#operation/createSiteDeploy */
    const response = await client.deploy(siteId, args.dir, {
      draft: !args.production,
      message: args.message
    });

    const url = args.production ? response.deploy.ssl_url : response.deploy.deploy_ssl_url;
    const logUrl = `${response.deploy.admin_url}/deploys/${response.deploy.id}`;

    retVal = { url, logUrl };
  } catch (error) {
    handleErrorMessage(error, 'netlify-deploy', args.spinner);
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('netlify-deploy');

  return command
    .description('deploy to a Netlify site')
    .arguments('<dir>')
    .option('-p, --production', 'production deploy')
    .option('-t, --token <token>', 'access token')
    .option('-i, --id <id>', 'site API ID')
    .option('-m, --message <message>', 'deploy message')
    .action(async dir => {
      try {
        spinner.start();

        const result = await execute({
          dir,
          production: command.production,
          token: command.token,
          siteId: command.id,
          message: command.message
        });

        if (result) {
          handleSuccessMessage(result.url, spinner);
        } else {
          spinner.fail(`Unable to deploy ${dir}`);
          process.exit(1);
        }
      } finally {
        spinner.stop();
      }
    });
};
