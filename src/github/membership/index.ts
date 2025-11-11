/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { repository as getRepository, token as getToken } from '../index.js';
import { handleErrorMessage, handleSuccessMessage } from '../../utils/index.js';
import { Command } from 'commander';
import { Octokit } from '@octokit/rest';
import { Ora } from 'ora';

interface IGitHubMembershipArgs {
  org?: string;
  users?: string[];
  path?: string;
  token?: string;
  spinner?: Ora;
}

type RETVAL = {
  success: string[];
  failure: string[];
};

/**
 * Execute the `github-membership` command.
 *
 * @param {string} [args.org] GitHub organization name.
 * @param {string[]} [args.users] GitHub user names to remove from membership.
 * @param {string} [args.path] Path to a git directory.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<object>} The success and failure results of the membership command.
 */
export const execute = async (args: IGitHubMembershipArgs): Promise<RETVAL> => {
  const retVal: RETVAL = { success: [], failure: [] };

  try {
    const auth = args.token || (await getToken(args.spinner));
    const github = new Octokit({ auth });
    const org = (args.org || (await getRepository(args.path, args.spinner))?.owner)!;

    if (args.users) {
      const requests = [];

      for (const user of args.users) {
        /* https://octokit.github.io/rest.js/v21/#orgs-remove-member */
        const request = github.orgs.removeMember({ org, username: user });

        requests.push(request);
      }

      await Promise.allSettled(requests).then(results => {
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            const user = result.value.url.split('/').pop();

            retVal.success.push(user!);
          } else {
            const user = result.reason.response.url.split('/').pop();

            if (typeof user === 'string') {
              retVal.failure.push(user);
            }

            handleErrorMessage(result.reason, 'github-membership', args.spinner);
          }
        });
      });
    } else {
      /* https://octokit.github.io/rest.js/v21/#orgs-list-members */
      const members = await github.paginate(github.orgs.listMembers, { org, per_page: 100 });

      retVal.success = members.map(member => member.login).sort();
    }
  } catch (error: unknown) {
    handleErrorMessage(error, 'github-membership', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('github-membership');

  return command
    .description('manage GitHub organization membership')
    .option('-o, --org [org]', 'GitHub organization name; defaults to repository owner')
    .option('-d --delete <users...>', 'remove members')
    .option('-l --list', 'list members')
    .option('-p, --path <path>', 'git directory')
    .option('-t, --token <token>', 'access token')
    .action(async () => {
      try {
        spinner.start();

        const options = command.opts();
        const results = await execute({
          org: options.org,
          users: options.delete,
          path: options.path,
          token: options.token,
          spinner
        });
        const toMessage = (members: string[]): string => {
          let retVal: string;

          if (options.list) {
            retVal = members.join(', ');
          } else {
            const length = members.length;

            retVal = `${length} ${length === 1 ? 'member' : 'members'}`;
          }

          return retVal;
        };

        if (results.success.length > 0) {
          let message = toMessage(results.success);

          if (options.delete) {
            message = `Removed: ${message}`;
          }

          handleSuccessMessage(message, spinner);
        }

        if (results.failure.length > 0) {
          let message = toMessage(results.failure);

          if (options.delete) {
            message = `Failed: ${message}`;
          }

          handleErrorMessage(message, 'github-membership', spinner);
        }
      } catch {
        spinner.fail('GitHub membership not found');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
