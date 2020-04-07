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
 * Execute the `github-branch` command.
 *
 * @param {string} [path] Path to a git directory.
 *
 * @returns {Promise<string>} The branch name provided by a CI environment
 * variable or extracted from the given git repository.
 */
export const execute = async (path?: string): Promise<string | undefined> => {
  let retVal: string | undefined = process.env.CIRCLE_BRANCH || process.env.TRAVIS_BRANCH;

  if (!retVal) {
    const args = ['branch', '--show-current'];

    if (path) {
      args.unshift('-C', path);
    }

    try {
      const branch = await execa('git', args);

      retVal = branch.stdout.toString();
    } catch (error) {
      console.error(red(error));
    }
  }

  return retVal;
};

export default () => {
  const command = new Command('github-branch');

  return command
    .description('show GitHub branch name')
    .arguments('[path]')
    .action(async path => {
      const branch = await execute(path);

      if (branch) {
        console.log(branch);
      } else {
        console.error(red('GitHub branch not found'));
        process.exit(1);
      }
    });
};
