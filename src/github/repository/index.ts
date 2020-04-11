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
 * Execute the `github-repository` command.
 *
 * @param {string} [path] Path to a git directory.
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<Array>} The repository [owner, name] provided by CI
 * environment variables or extracted from the given git repository.
 */
export const execute = async (
  path?: string,
  spinner?: Ora
): Promise<[string, string] | undefined> => {
  let retVal: [string, string] | undefined;

  if (process.env.TRAVIS_REPO_SLUG) {
    retVal = process.env.TRAVIS_REPO_SLUG.split('/') as [string, string];
  } else if (process.env.CIRCLECI) {
    retVal = [
      process.env.CIRCLE_PROJECT_REPONAME as string,
      process.env.CIRCLE_PROJECT_USERNAME as string
    ];
  }

  if (!retVal) {
    const lsRemoteArgs = ['ls-remote', '--get-url'];
    const revParseArgs = ['rev-parse', '--show-toplevel'];

    if (path) {
      lsRemoteArgs.unshift('-C', path);
      revParseArgs.unshift('-C', path);
    }

    try {
      const remote = await execa('git', lsRemoteArgs);
      const url = await execa('dirname', [remote.stdout]);
      const owner = await execa('basename', [url.stdout]);
      const workingTree = await execa('git', revParseArgs);
      const repo = await execa('basename', [workingTree.stdout]);

      retVal = [owner.stdout.toString(), repo.stdout.toString()];
    } catch (error) {
      handleErrorMessage(error, 'github-repository', spinner);
    }
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('github-repository');

  return command
    .description('output GitHub repository name for the repo')
    .arguments('[path]')
    .action(async path => {
      try {
        spinner.start();

        const repository = await execute(path, spinner);

        if (repository) {
          handleSuccessMessage(`${repository[0]}/${repository[1]}`, spinner);
        } else {
          spinner.fail('GitHub repository not found');
          process.exit(1);
        }
      } finally {
        spinner.stop();
      }
    });
};
