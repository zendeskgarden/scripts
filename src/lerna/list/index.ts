/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import { Ora } from 'ora';
import execa from 'execa';

interface ILernaListArgs {
  path?: string;
  json?: boolean;
  spinner?: Ora;
}

/**
 * Execute the `lerna-list` command.
 *
 * @param {string} [args.path] Path to a git directory.
 * @param {boolean} [args.json] Parse output as a JSON array.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<Array>} The object result of the config command.
 */
export const execute = async (args: ILernaListArgs): Promise<Array<any> | undefined> => {
  let retVal: Array<any> | undefined;
  const listArgs = ['list', '--loglevel', 'silent'];

  if (args.json) {
    listArgs.push('--json');
  }

  try {
    const list = await execa('lerna', listArgs, {
      cwd: args.path,
      preferLocal: true
    });

    if (args.json) {
      retVal = JSON.parse(list.stdout);
    } else {
      retVal = list.stdout.split('\n');
    }
  } catch (error) {
    handleErrorMessage(error.message ? error.message : error, 'lerna-list', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('lerna-list');

  return command
    .description('list Lerna packages for the repo')
    .arguments('[path]')
    .option('--json', 'list as a JSON array')
    .action(async path => {
      try {
        spinner.start();

        const list = await execute({
          path,
          json: command.json,
          spinner
        });

        if (list) {
          const message = command.json
            ? JSON.stringify(list, null /* replacer */, 2 /* space */)
            : list.join('\n');

          spinner.clear();
          handleSuccessMessage(message);
          handleSuccessMessage(
            `Found ${list.length} ${list.length === 1 ? 'package' : 'packages'}`,
            spinner
          );
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Unable to find Lerna packages');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
