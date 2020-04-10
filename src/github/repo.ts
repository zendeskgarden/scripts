/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { handleErrorMessage, handleSuccessMessage } from '../utils';
import { Command } from 'commander';
import { Ora } from 'ora';
import execa from 'execa';

/**
 * Execute the `github-repo` command.
 *
 * @param {string} [path] Path to a git directory.
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The repo name provided by a CI environment
 * variable or extracted from the given git repository.
 */
export const execute = async (path?: string, spinner?: Ora): Promise<string | undefined> => {
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
      handleErrorMessage(error, 'github-repo', spinner);
    }
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('github-repo');

  return command
    .description('show GitHub repo name')
    .arguments('[path]')
    .action(async path => {
      try {
        spinner.start();

        const repo = await execute(path, spinner);

        if (repo) {
          handleSuccessMessage(repo, spinner);
        } else {
          spinner.fail('GitHub repo not found');
          process.exit(1);
        }
      } finally {
        spinner.stop();
      }
    });
};
