/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Command } from 'commander';
import execa from 'execa';
import { red } from 'chalk';

/**
 * Execute the `netlify-token` command.
 *
 * @returns {string} The token provided by the `NETLIFY_TOKEN` environment
 * variable or the value of the `netlify.token` git configuration option.
 */
export const execute = async (): Promise<string | undefined> => {
  let retVal = process.env.NETLIFY_TOKEN;

  if (!retVal) {
    try {
      const token = await execa('git', ['config', '--get', 'netlify.token']);

      retVal = token.stdout.toString();
    } catch (error) {
      console.error(red(error));
    }
  }

  return retVal;
};

export default () => {
  const command = new Command('netlify-token');

  return command
    .description('show Netlify personal access token')
    .option('--no-mask', 'display unobscured token')
    .action(async () => {
      const token = await execute();

      if (token) {
        console.log(command.mask ? `${token.slice(0, 4)}......${token.slice(-4)}` : token);
      } else {
        console.error(red('Netlify token not found'));
        process.exit(1);
      }
    });
};
