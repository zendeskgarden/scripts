/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Ora } from 'ora';
import { execa } from 'execa';

/**
 * Execute the `netlify-token` command.
 *
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The token provided by the `NETLIFY_TOKEN`
 * environment variable or the value of the `netlify.token` git configuration
 * option.
 */
export const execute = async (spinner?: Ora): Promise<string | undefined> => {
  let retVal = process.env.NETLIFY_TOKEN;

  if (!retVal) {
    try {
      const token = await execa('git', ['config', '--get', 'netlify.token']);

      retVal = token.stdout.toString();
    } catch (error: unknown) {
      handleErrorMessage(error, 'netlify-token', spinner);

      throw error;
    }
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('netlify-token');

  return command
    .description('output Netlify personal access token')
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
        spinner.fail('Netlify token not found');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
