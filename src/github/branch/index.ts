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
 * Execute the `github-branch` command.
 *
 * @param {string} [path] Path to a git directory.
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The branch name provided by a CI environment
 * variable or extracted from the given git repository.
 */
export const execute = async (path?: string, spinner?: Ora): Promise<string | undefined> => {
  let retVal: string | undefined;

  if (process.env.GITHUB_ACTIONS) {
    // https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
    retVal =
      process.env.GITHUB_EVENT_NAME === 'pull_request'
        ? process.env.GITHUB_HEAD_REF
        : process.env.GITHUB_REF_NAME;
  } else {
    retVal =
      process.env.CIRCLE_BRANCH ||
      process.env.TRAVIS_PULL_REQUEST_BRANCH ||
      process.env.TRAVIS_BRANCH;
  }

  if (!retVal) {
    const args = ['branch', '--show-current'];

    if (path) {
      args.unshift('-C', path);
    }

    try {
      const branch = await execa('git', args);

      retVal = branch.stdout;
    } catch (error: unknown) {
      handleErrorMessage(error, 'github-branch', spinner);

      throw error;
    }
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('github-branch');

  return command
    .description('output GitHub branch name for the repo')
    .arguments('[path]')
    .action(async (path: string) => {
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
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
