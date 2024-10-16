/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { ExecaError, execa } from 'execa';
import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Command } from 'commander';
import { Ora } from 'ora';

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
export const execute = async (args: ICommandCodemodArgs): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const paths = Array.isArray(args.paths) ? args.paths : [args.paths];
    const codemodArgs = [
      '--fail-on-error',
      '--run-in-band',
      `--transform=${args.transform}`,
      ...paths
    ];
    const codemod = await execa('jscodeshift', codemodArgs, { preferLocal: true });

    retVal = codemod.stdout;
  } catch (error: unknown) {
    handleErrorMessage((error as ExecaError).message, 'cmd-codemod', args.spinner);

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
    .action(async (paths: string[]) => {
      try {
        spinner.start();

        const options = command.opts();
        const codemod = await execute({ paths, transform: options.transform, spinner });

        if (codemod) {
          handleSuccessMessage(codemod, spinner);
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
