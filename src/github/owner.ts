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
 * Execute the `github-owner` command.
 *
 * @param {string} [path] Path to a git directory.
 *
 * @returns {Promise<string>} The owner provided by a CI environment variable
 * or extracted from the given git repository.
 */
export const execute = async (path?: string): Promise<string | undefined> => {
  let retVal: string | undefined;

  if (process.env.TRAVIS_REPO_SLUG) {
    retVal = process.env.TRAVIS_REPO_SLUG[0];
  } else {
    retVal = process.env.CIRCLE_PROJECT_USERNAME as string;
  }

  if (!retVal) {
    const args = ['ls-remote', '--get-url'];

    if (path) {
      args.unshift('-C', path);
    }

    try {
      const remote = await execa('git', args);
      const url = await execa('dirname', [remote.stdout]);
      const owner = await execa('basename', [url.stdout]);

      retVal = owner.stdout.toString();
    } catch (error) {
      console.error(red(error));
    }
  }

  return retVal;
};

export default () => {
  const command = new Command('github-owner');

  return command
    .description('show GitHub repository owner')
    .arguments('[path]')
    .action(async path => {
      const owner = await execute(path);

      if (owner) {
        console.log(owner);
      } else {
        console.error(red('GitHub owner not found'));
        process.exit(1);
      }
    });
};
