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
 * Execute the `github-repo` command.
 *
 * @param {string} [path] Path to a git directory.
 *
 * @returns {Promise<string>} The repo name provided by a CI environment
 * variable or extracted from the given git repository.
 */
export const execute = async (path?: string): Promise<string | undefined> => {
  let retVal: string | undefined;

  if (process.env.TRAVIS_REPO_SLUG) {
    retVal = process.env.TRAVIS_REPO_SLUG.split('/')[1];
  } else {
    retVal = process.env.CIRCLE_PROJECT_REPONAME as string;
  }

  if (!retVal) {
    const args = ['rev-parse', '--show-toplevel'];

    if (path) {
      args.unshift('-C', path);
    }

    try {
      const workingTree = await execa('git', args);
      const repo = await execa('basename', [workingTree.stdout]);

      retVal = repo.stdout.toString();
    } catch (error) {
      console.error(red(error));
    }
  }

  return retVal;
};

export default () => {
  const command = new Command('github-repo');

  return command
    .description('show GitHub repo name')
    .arguments('[path]')
    .action(async path => {
      const repo = await execute(path);

      if (repo) {
        console.log(repo);
      } else {
        console.error(red('GitHub repo not found'));
        process.exit(1);
      }
    });
};
