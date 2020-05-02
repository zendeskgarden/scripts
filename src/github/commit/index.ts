/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { branch as getBranch, repository as getRepository, token as getToken } from '..';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import { Octokit } from '@octokit/rest';
import { Ora } from 'ora';

interface IGitHubCommitArgs {
  path?: string;
  token?: string;
  branch?: string;
  spinner?: Ora;
}

/**
 * Execute the `github-commit` command.
 *
 * @param {string} [args.path] Path to a git directory.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.branch] GitHub branch.
 * @param {string} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The latest commit SHA provided by a CI
 * environment variable or remote GitHub commits for the given git repository.
 */
export const execute = async (args: IGitHubCommitArgs = {}): Promise<string | undefined> => {
  let retVal: string | undefined =
    process.env.CIRCLE_SHA1 || process.env.TRAVIS_PULL_REQUEST_SHA || process.env.TRAVIS_COMMIT;

  if (!retVal) {
    try {
      const auth = args.token || (await getToken(args.spinner));
      const github = new Octokit({ auth });
      const repository = (await getRepository(args.path, args.spinner))!;
      const sha = args.branch || (await getBranch(args.path, args.spinner));

      /* https://octokit.github.io/rest.js/v17#repos-list-commits */
      const commits = await github.repos.listCommits({
        owner: repository.owner,
        repo: repository.repo,
        sha
      });

      if (commits && commits.data) {
        retVal = commits.data[0].sha;
      }
    } catch (error) {
      if (error.status !== 404) {
        handleErrorMessage(error, 'github-commit', args.spinner);

        throw error;
      }
    }
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('github-commit');

  return command
    .description('output latest GitHub commit SHA for the repo branch')
    .arguments('[path]')
    .option('-b, --branch <branch>', 'GitHub branch name')
    .option('-t, --token <token>', 'access token')
    .action(async path => {
      try {
        spinner.start();

        const commit = await execute({
          path,
          branch: command.branch,
          token: command.token,
          spinner
        });

        if (commit) {
          handleSuccessMessage(commit, spinner);
        } else {
          throw spinner.fail('Commit not found');
        }
      } catch (error) {
        process.exit(1);
      } finally {
        spinner.stop();
      }
    });
};
