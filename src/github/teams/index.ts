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

interface IGitHubTeamsArgs {
  org?: string;
  path?: string;
  user?: string | boolean;
  token?: string;
  spinner?: Ora;
}

export const execute = async (args: IGitHubTeamsArgs): Promise<string[] | undefined> => {
  let retVal: string[] | undefined;

  try {
    const org = (args.org || (await getRepository(args.path, args.spinner))?.owner)!;

    if (args.user) {
      // {
      //   organization(login: "my-org") {
      //     teams(userLogins: ["johndoe"]) {
      //       totalCount
      //       edges {
      //         node {
      //           name
      //         }
      //       }
      //     }
      //   }
      // }
    } else {
      const auth = args.token || (await getToken(args.spinner));
      const github = new Octokit({ auth });

      /* https://octokit.github.io/rest.js/v17#teams-list */
      const teams = await github.teams.list({ org });

      retVal = teams.data.map(team => team.name).sort();
    }
  } catch (error: unknown) {
    handleErrorMessage(error, 'github-teams', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('github-teams');

  return command
    .description('output GitHub organization teams')
    .argument('[org]', 'GitHub organization name; defaults to repository owner')
    .option('-u --user [user]', 'user to get team membership for; defaults to current')
    .option('-p, --path <path>', 'git directory')
    .option('-a, --token <token>', 'access token')
    .action(async org => {
      try {
        spinner.start();

        const options = command.opts();
        const teams = await execute({
          org,
          user: options.user,
          path: options.path,
          token: options.token,
          spinner
        });

        if (teams) {
          const message = teams.join(', ');

          handleSuccessMessage(message, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('GitHub teams not found');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
