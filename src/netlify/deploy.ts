/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { siteId as getSiteId, token as getToken } from '.';
import { Command } from 'commander';
import NetlifyAPI from 'netlify';
import { red } from 'chalk';

type ARGS = {
  dir: string;
  production: boolean;
  token?: string;
  siteId?: string;
  message?: string;
};

/**
 * Execute the `netlify-deploy` command.
 *
 * @param {string} args.dir Folder to deploy.
 * @param {string} args.production Determine whether this is a production deploy.
 * @param {string} [args.message] Deploy message.
 * @param {string} [args.token] Netlify personal access token.
 * @param {string} [args.siteId] Netlify site API ID.
 */
export const execute = async (
  args: ARGS = { dir: '', production: false }
): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const token = args.token || (await getToken());
    const client = new NetlifyAPI(token);
    const siteId = args.siteId || (await getSiteId());

    /* https://open-api.netlify.com/#operation/createSiteDeploy */
    const response = await client.deploy(siteId, args.dir, {
      draft: !args.production,
      message: args.message
    });

    retVal = args.production ? response.deploy.ssl_url : response.deploy.deploy_ssl_url;
  } catch (error) {
    console.error(red(error));
  }

  return retVal;
};

export default () => {
  const command = new Command('netlify-deploy');

  return command
    .description('deploy to a Netlify site')
    .arguments('<dir>')
    .option('-t, --token <token>', 'access token')
    .option('-i, --id <id>', 'site API ID')
    .option('-p, --production', 'production deploy')
    .option('-m, --message <message>', 'deploy message')
    .action(async dir => {
      const url = await execute({
        dir,
        production: command.production,
        token: command.token,
        siteId: command.id,
        message: command.message
      });

      if (url) {
        console.log(url);
      } else {
        console.error(red(`Unable to deploy ${dir}`));
        process.exit(1);
      }
    });
};
