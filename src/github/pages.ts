/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { owner as getOwner, repo as getRepo, token as getToken } from '.';
import { Command } from 'commander';
import { publish } from 'gh-pages';
import { red } from 'chalk';

type ARGS = {
  dir: string;
  message?: string;
  token?: string;
  owner?: string;
  repo?: string;
};

/**
 * Execute the `github-pages` command.
 *
 * @param {string} args.dir Folder to publish.
 * @param {string} [args.message] Commit message.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.owner] GitHub repository owner.
 * @param {string} [args.repo] GitHub repository name.
 */
export const execute = async (args: ARGS = { dir: '' }) => {
  const token = args.token || (await getToken());
  const owner = args.owner || (await getOwner(args.dir));
  const repo = args.repo || (await getRepo(args.dir));
  const message = args.message || 'Updates [skip ci]';

  if (token && owner && repo) {
    publish(args.dir, {
      repo: `https://${token}@github.com/${owner}/${repo}.git`,
      user: {
        name: 'Zendesk Garden',
        email: 'garden@zendesk.com'
      },
      message,
      silent: true
    });
  } else {
    throw new Error('Invalid git repository');
  }
};

export default () => {
  const command = new Command('github-pages');

  return command
    .description('publish to a GitHub "gh-pages" branch')
    .arguments('<dir>')
    .option('-m, --message <message>', 'commit message')
    .action(async dir => {
      try {
        await execute({ dir });
      } catch (error) {
        console.error(red(error));
        process.exit(1);
      }
    });
};
