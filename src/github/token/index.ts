/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Command } from 'commander';
import { Ora } from 'ora';
import { execa } from 'execa';

/**
 * Execute the `github-token` command.
 *
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The token provided by the `GITHUB_TOKEN`
 * environment variable or the value of the `github.token` git configuration
 * option.
 */
export const execute = async (spinner?: Ora): Promise<string | undefined> => {
  let retVal: string | undefined = process.env.GITHUB_TOKEN;

  if (!retVal) {
    try {
      const token = await execa('git', ['config', '--get', 'github.token']);

      retVal = token.stdout.toString();
    } catch (error: unknown) {
      handleErrorMessage(error, 'github-token', spinner);

      throw error;
    }
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('github-token');

  return command
    .description('output GitHub personal access token')
    .option('--no-mask', 'display unobscured token')
    .action(async () => {
      try {
        spinner.start();

        const token = await execute(spinner);

        if (token) {
          handleSuccessMessage(
            command.opts().mask ? `${token.slice(0, 4)}......${token.slice(-4)}` : token,
            spinner
          );
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('GitHub token not found');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
