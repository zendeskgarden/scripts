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

type RETVAL = {
  owner: string;
  repo: string;
};

/**
 * Execute the `github-repository` command.
 *
 * @param {string} [path] Path to a git directory.
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<object>} The repository {owner, name} provided by CI
 * environment variables or extracted from the given git repository.
 */
export const execute = async (path?: string, spinner?: Ora): Promise<RETVAL | undefined> => {
  let retVal: RETVAL | undefined;

  if (process.env.TRAVIS_REPO_SLUG) {
    const [owner, repo] = process.env.TRAVIS_REPO_SLUG.split('/') as [string, string];

    retVal = { owner, repo };
  } else if (process.env.CIRCLECI) {
    const owner = process.env.CIRCLE_PROJECT_USERNAME as string;
    const repo = process.env.CIRCLE_PROJECT_REPONAME as string;

    retVal = { owner, repo };
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
      const gitOwner = await execa('basename', [url.stdout]);
      const workingTree = await execa('git', revParseArgs);
      const gitRepo = await execa('basename', [workingTree.stdout]);

      retVal = { owner: gitOwner.stdout.toString(), repo: gitRepo.stdout.toString() };
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
          handleSuccessMessage(`${repository.owner}/${repository.repo}`, spinner);
        } else {
          spinner.fail('GitHub repository not found');
          process.exit(1);
        }
      } finally {
        spinner.stop();
      }
    });
};
