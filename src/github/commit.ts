/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { branch as getBranch, owner as getOwner, repo as getRepo, token as getToken } from '.';
import { Command } from 'commander';
import { Octokit } from '@octokit/rest';
import { red } from 'chalk';

type ARGS = {
  path?: string;
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
};

/**
 * Execute the `github-commit` command.
 *
 * @param {string} [args.path] Path to a git directory.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.owner] GitHub repository owner.
 * @param {string} [args.repo] GitHub repository name.
 *
 * @returns {Promise<string>} The latest commit SHA provided by a CI
 * environment variable or remote GitHub commits for the given git repository.
 */
export const execute = async (args: ARGS = {}): Promise<string | undefined> => {
  let retVal: string | undefined = process.env.CIRCLE_SHA1 || process.env.TRAVIS_COMMIT;

  if (!retVal) {
    try {
      const auth = args.token || (await getToken());
      const github = new Octokit({ auth });
      const owner = (args.owner || (await getOwner(args.path)))!;
      const repo = (args.repo || (await getRepo(args.path)))!;
      const sha = (args.branch || (await getBranch(args.path)))!;

      /* https://octokit.github.io/rest.js/v17#repos-list-commits */
      const commits = await github.repos.listCommits({
        owner,
        repo,
        sha
      });

      if (commits && commits.data) {
        retVal = commits.data[0].sha;
      } else {
        retVal = undefined;
      }
    } catch (error) {
      console.error(red(error));
    }
  }

  return retVal;
};

export default () => {
  const command = new Command('github-commit');

  return command
    .description('latest GitHub commit SHA for the repo branch')
    .arguments('[path]')
    .action(async path => {
      const commit = await execute({ path });

      if (commit) {
        console.log(commit);
      } else {
        console.error(red('Commit not found'));
        process.exit(1);
      }
    });
};
