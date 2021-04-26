/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
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
    const owner = process.env.CIRCLE_PROJECT_USERNAME!;
    const repo = process.env.CIRCLE_PROJECT_REPONAME!;

    retVal = { owner, repo };
  }

  if (!retVal) {
    const lsRemoteArgs = ['ls-remote', '--get-url'];

    if (path) {
      lsRemoteArgs.unshift('-C', path);
    }

    try {
      const remote = await execa('git', lsRemoteArgs);
      const regexp = /^.+github\.com[/:](?<owner>[\w-]+)\/(?<repo>[\w.-]+)\.git$/u;
      /* eslint-disable-next-line @typescript-eslint/prefer-regexp-exec */
      const match = remote.stdout.match(regexp);

      if (match && match.groups) {
        const owner = match.groups.owner;
        const repo = match.groups.repo;

        retVal = { owner, repo };
      } else {
        handleErrorMessage(`Unexpected remote URL: ${remote.stdout}`, 'github-repository', spinner);
      }
    } catch (error: unknown) {
      handleErrorMessage(error, 'github-repository', spinner);

      throw error;
    }
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('github-repository');

  return command
    .description('output GitHub repository name for the repo')
    .arguments('[path]')
    .action(async path => {
      try {
        spinner.start();

        const repository = await execute(path as string, spinner);

        if (repository) {
          handleSuccessMessage(`${repository.owner}/${repository.repo}`, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('GitHub repository not found');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
