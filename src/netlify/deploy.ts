/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Command } from 'commander';
import NetlifyAPI from 'netlify';

export const execute = (
  token: string,
  siteId: string,
  dir: string,
  draft: boolean,
  message?: string
) => {
  const client = new NetlifyAPI(token);

  return client.deploy(siteId, dir, {
    draft,
    message
  });
};

export default () => {
  const command = new Command('netlify-deploy');

  return command
    .requiredOption('-d, --dir <dir>', 'folder to deploy')
    .requiredOption('-t, --token <token>', 'access token', process.env.NETLIFY_TOKEN)
    .requiredOption('-i, --id <id>', 'site API ID', process.env.NETLIFY_SITE_ID)
    .option('-p, --production', 'production deploy')
    .option('-m, --message [message]', 'deploy message')
    .action(async function action() {
      try {
        const response = await execute(
          command.token,
          command.id,
          command.dir,
          !command.production,
          command.message
        );

        console.log(response.deploy.deploy_ssl_url);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });
};
