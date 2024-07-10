/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { dirname, resolve } from 'node:path';
import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Command } from 'commander';
import { Ora } from 'ora';
import { fileURLToPath } from 'node:url';
import { default as walk } from 'klaw';

/**
 * Execute the `cmd-du` command.
 *
 * @param {string} [dir] Directory to calculate size for.
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<number>} The disk usage, in bytes, for the given directory.
 */
export const execute = async (dir?: string, spinner?: Ora): Promise<number> => {
  let retVal = 0;

  try {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const root = resolve(dir || currentDir);

    for await (const file of walk(root)) {
      if (file.path !== root) {
        retVal += file.stats.size;
      }
    }
  } catch (error: unknown) {
    handleErrorMessage(error, 'cmd-du', spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('cmd-du');

  return command
    .description('output disk usage')
    .argument('[dir]', 'directory to get usage for; defaults to the current directory')
    .action(async (dir: string) => {
      try {
        spinner.start();
        const usage = await execute(dir, spinner);

        if (usage > 0) {
          handleSuccessMessage(usage.toString(), spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Invalid directory');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
