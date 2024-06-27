/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { clean, publish } from 'gh-pages';
import { repository as getRepository, token as getToken } from '../index.js';
import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Command } from 'commander';
import { Ora } from 'ora';
import { execa } from 'execa';

interface IGitHubPagesArgs {
  dir: string;
  disableJekyll?: boolean;
  path?: string;
  message?: string;
  token?: string;
  spinner?: Ora;
}

/**
 * Execute the `github-pages` command.
 *
 * @param {string} args.dir Folder to publish.
 * @param {boolean} [args.disableJekyll] Disable Jekyll.
 * @param {string} [args.path] Path to a git directory.
 * @param {string} [args.message] Commit message.
 * @param {string} [args.token] GitHub personal access token.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The GitHub pages URL.
 */
export const execute = async (args: IGitHubPagesArgs): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const token = args.token || (await getToken(args.spinner));
    const repository = await getRepository(args.path || args.dir, args.spinner);
    const message = args.message || 'Updates [skip ci]';

    if (token && repository) {
      const { owner, repo } = repository;
      let name: string;
      let email: string;

      try {
        name = (await execa('git', ['config', 'user.name'])).stdout.toString();
        email = (await execa('git', ['config', 'user.email'])).stdout.toString();
      } catch {
        name = 'Zendesk Garden';
        email = 'garden@zendesk.com';
      }

      clean();
      await publish(
        args.dir,
        {
          repo: `https://${token}@github.com/${owner}/${repo}.git`,
          user: {
            name,
            email
          },
          message,
          nojekyll: args.disableJekyll,
          silent: true
        },
        error => {
          if (error) {
            handleErrorMessage(error, 'github-pages', args.spinner);
          } else {
            retVal = `https://${owner}.github.io/${repo}/`;
          }
        }
      );
    } else {
      throw new Error('Invalid git repository');
    }
  } catch (error: unknown) {
    handleErrorMessage(error, 'github-pages', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('github-pages');

  return command
    .description('publish to a GitHub "gh-pages" branch')
    .argument('<dir>', 'directory of web content to publish')
    .option('-p, --path <path>', 'git directory')
    .option('-t, --token <token>', 'access token')
    .option('-m, --message <message>', 'commit message')
    .option('-n, --no-jekyll', 'disable Jekyll')
    .action(async dir => {
      try {
        spinner.start();

        const options = command.opts();
        const url = await execute({
          dir,
          disableJekyll: !options.jekyll,
          path: options.path,
          message: options.message,
          token: options.token,
          spinner
        });

        if (url) {
          handleSuccessMessage(url, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail(`Unable to publish '${dir}'`);
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
