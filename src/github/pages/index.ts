/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { repository as getRepository, token as getToken } from '..';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import { Ora } from 'ora';
import { publish } from 'gh-pages';

type ARGS = {
  dir: string;
  message?: string;
  token?: string;
  repository?: [string, string];
  spinner?: Ora;
};

/**
 * Execute the `github-pages` command.
 *
 * @param {string} args.dir Folder to publish.
 * @param {string} [args.message] Commit message.
 * @param {string} [args.token] GitHub personal access token.
 * @param {Array} [args.repository] GitHub repository.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The GitHub pages URL.
 */
export const execute = async (args: ARGS = { dir: '' }): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const token = args.token || (await getToken(args.spinner));
    const repository = args.repository || (await getRepository(args.dir, args.spinner));
    const message = args.message || 'Updates [skip ci]';

    if (token && repository) {
      const [owner, repo] = repository;

      publish(args.dir, {
        repo: `https://${token}@github.com/${owner}/${repo}.git`,
        user: {
          name: 'Zendesk Garden',
          email: 'garden@zendesk.com'
        },
        message,
        silent: true
      });

      retVal = `https://${owner}.github.io/${repo}/`;
    } else {
      throw new Error('Invalid git repository');
    }
  } catch (error) {
    handleErrorMessage(error, 'github-pages', args.spinner);
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('github-pages');

  return command
    .description('publish to a GitHub "gh-pages" branch')
    .arguments('<dir>')
    .option('-m, --message <message>', 'commit message')
    .action(async dir => {
      try {
        spinner.start();

        const url = await execute({ dir, message: command.message, spinner });

        if (url) {
          handleSuccessMessage(url, spinner);
        } else {
          spinner.fail(`Unable to publish '${dir}'`);
          process.exit(1);
        }
      } finally {
        spinner.stop();
      }
    });
};
