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

type RETVAL = {
  errored: number;
  unmodified: number;
  skipped: number;
  modified: number;
};

interface ICommandCodemodArgs {
  paths: string[] | string;
  transform: string;
  spinner?: Ora;
}

/**
 * Execute the `cmd-codemod` command.
 *
 * @param {string[] | string} args.paths Code path globs.
 * @param {string} args.transform Location of the transform file.
 */
export const execute = async (args: ICommandCodemodArgs): Promise<RETVAL | undefined> => {
  let retVal: RETVAL | undefined;

  try {
    const paths = Array.isArray(args.paths) ? args.paths : [args.paths];
    const codemodArgs = [
      '--fail-on-error',
      '--run-in-band',
      `--transform=${args.transform}`,
      ...paths
    ];
    const codemod = await execa('jscodeshift', codemodArgs, { preferLocal: true });

    if (codemod.stderr) {
      throw new Error(codemod.stderr);
    } else {
      const errored = /^(?<errored>\d+) errors$/gmu.exec(codemod.stdout)?.groups?.errored;
      const unmodified = /^(?<unmodified>\d+) unmodified$/gmu.exec(codemod.stdout)?.groups
        ?.unmodified;
      const skipped = /^(?<skipped>\d+) skipped$/gmu.exec(codemod.stdout)?.groups?.skipped;
      const modified = /^(?<modified>\d+) ok$/gmu.exec(codemod.stdout)?.groups?.modified;

      retVal = {
        errored: errored ? parseInt(errored, 10) : 0,
        unmodified: unmodified ? parseInt(unmodified, 10) : 0,
        skipped: skipped ? parseInt(skipped, 10) : 0,
        modified: modified ? parseInt(modified, 10) : 0
      };
    }
  } catch (error: unknown) {
    handleErrorMessage((error as Error).message, 'cmd-codemod', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('cmd-codemod');

  return command
    .description('execute a codebase migration')
    .argument('<paths...>', 'one or more code paths')
    .requiredOption(
      '-t --transform <transform>',
      'location (local path or remote URL) of the transform file'
    )
    .option('--pretty', 'pretty-print result')
    .action(async (paths: string[]) => {
      try {
        spinner.start();

        const options = command.opts();
        const result = await execute({ paths, transform: options.transform, spinner });

        if (result) {
          const space = options.pretty ? 2 : undefined;
          const message = JSON.stringify(result, undefined, space);

          handleSuccessMessage(message, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Unable to apply codemod');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
