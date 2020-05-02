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

/**
 * Execute the `github-branch` command.
 *
 * @param {string} [path] Path to a git directory.
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The branch name provided by a CI environment
 * variable or extracted from the given git repository.
 */
export const execute = async (path?: string, spinner?: Ora): Promise<string | undefined> => {
  let retVal: string | undefined =
    process.env.CIRCLE_BRANCH ||
    process.env.TRAVIS_PULL_REQUEST_BRANCH ||
    process.env.TRAVIS_BRANCH;

  if (!retVal) {
    const args = ['branch', '--show-current'];

    if (path) {
      args.unshift('-C', path);
    }

    try {
      const branch = await execa('git', args);

      retVal = branch.stdout.toString();
    } catch (error) {
      handleErrorMessage(error, 'github-branch', spinner);

      throw error;
    }
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('github-branch');

  return command
    .description('output GitHub branch name for the repo')
    .arguments('[path]')
    .action(async path => {
      try {
        spinner.start();

        const branch = await execute(path, spinner);

        if (branch) {
          handleSuccessMessage(branch, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('GitHub branch not found');
        process.exit(1);
      } finally {
        spinner.stop();
      }
    });
};
