/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { repository as getRepository, token as getToken } from '../index.js';
import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Octokit } from '@octokit/rest';
import { Ora } from 'ora';

interface IGitHubReleaseArgs {
  tag: string;
  body: string;
  published?: boolean;
  path?: string;
  token?: string;
  spinner?: Ora;
}

/**
 * Execute the `github-release` command.
 *
 * @param {string} args.tag Tag name.
 * @param {string} args.body Body markdown content.
 * @param {boolean} [args.published] Determine if the release is published or draft.
 * @param {string} [args.path] Path to a git directory.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The GitHub release URL.
 */
export const execute = async (args: IGitHubReleaseArgs): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const auth = args.token || (await getToken(args.spinner));
    const github = new Octokit({ auth });
    const repository = (await getRepository(args.path, args.spinner))!;

    /* https://octokit.github.io/rest.js/v17#repos-create-release */
    const release = await github.repos.createRelease({
      owner: repository.owner,
      repo: repository.repo,
      tag_name: args.tag,
      body: args.body,
      draft: !args.published
    });

    const url = release.data.html_url;

    retVal = args.published ? url : url.replace('/tag/', '/edit/');
  } catch (error: unknown) {
    handleErrorMessage(error, 'github-release', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('github-release');

  return command
    .description('create a GitHub release')
    .argument('<markdown>', 'markdown content')
    .requiredOption('-t, --tag <tag>', 'tag name')
    .option('-p, --published', 'published (non-draft) release')
    .option('-d, --path <path>', 'git directory')
    .option('-a, --token <token>', 'access token')
    .action(async markdown => {
      try {
        spinner.start();

        const options = command.opts();
        const release = await execute({
          tag: options.tag,
          body: markdown,
          published: options.published,
          path: options.path,
          token: options.token,
          spinner
        });

        if (release) {
          handleSuccessMessage(release, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Unable to release');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
