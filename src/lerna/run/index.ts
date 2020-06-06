/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import { Ora } from 'ora';
import { RunCommand } from '@lerna/run';

interface ILernaRunArgs {
  script: string;
  ignore?: string;
  path?: string;
  scope?: string;
  since?: string;
  stream?: boolean;
  spinner?: Ora;
}

/**
 * Execute the `lerna-run` command.
 *
 * @param {string} [args.path] Path to a git directory.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<any>} The object result of the config command.
 */
export const execute = async (args: ILernaRunArgs) => {
  let retVal: any | undefined;

  try {
    if (args.spinner && args.stream) {
      args.spinner.stop();
    }

    await new RunCommand({
      cwd: args.path,
      composed: 'string',
      loglevel: 'silent',
      ...args
    });
  } catch (error) {
    handleErrorMessage(error.message ? error.message : error, 'lerna-run', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('lerna-run');

  return command
    .description('run a npm script across a multi-package Lerna repo')
    .arguments('<script>')
    .option('-p, --path <path>', 'git directory')
    .option('--no-stream', 'prevent streaming ouput')
    .option('--ignore <glob>', 'ignore packages matching the given glob')
    .option('--scope <glob>', 'scope to packages matching the given glob')
    .option(
      '--since [ref]',
      'limit to packages since the specified ref (defaults to most recent tag)'
    )
    .action(async script => {
      try {
        spinner.start();

        await execute({
          script,
          path: command.path,
          stream: command.stream,
          ignore: command.ignore,
          scope: command.scope,
          since: command.since,
          spinner
        });

        handleSuccessMessage('Success', spinner);
      } catch {
        spinner.fail(`Error running '${script}'`);
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
