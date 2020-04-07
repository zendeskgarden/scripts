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
 * Execute the `github-token` command.
 *
 * @returns {Promise<string>} The token provided by the `GITHUB_TOKEN`
 * environment variable or the value of the `github.token` git configuration
 * option.
 */
export const execute = async (): Promise<string | undefined> => {
  let retVal: string | undefined = process.env.GITHUB_TOKEN;

  if (!retVal) {
    try {
      const token = await execa('git', ['config', '--get', 'github.token']);

      retVal = token.stdout.toString();
    } catch (error) {
      console.error(red(error));
    }
  }

  return retVal;
};

export default () => {
  const command = new Command('github-token');

  return command
    .description('show GitHub personal access token')
    .option('--no-mask', 'display unobscured token')
    .action(async () => {
      const token = await execute();

      if (token) {
        console.log(command.mask ? `${token.slice(0, 4)}......${token.slice(-4)}` : token);
      } else {
        console.error(red('GitHub token not found'));
        process.exit(1);
      }
    });
};
