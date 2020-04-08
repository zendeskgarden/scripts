/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { commit as getCommit, owner as getOwner, repo as getRepo, token as getToken } from '.';
import { Command } from 'commander';
import { Octokit } from '@octokit/rest';
import execa from 'execa';
import { red } from 'chalk';

type ARGS = {
  command: (...args: any[]) => Promise<string | undefined>;
  token?: string;
  owner?: string;
  repo?: string;
  ref?: string;
  environment?: 'staging' | 'production';
  description?: string;
};

/**
 * Execute the `github-deploy` command.
 *
 * @param {function} args.command Deployment command to execute.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.owner] GitHub repo owner.
 * @param {string} [args.repo] GitHub repo name.
 * @param {string} [args.ref] GitHub ref (commit SHA, branch, tag).
 * @param {string} [args.environment] Deployment environment.
 * @param {string} [args.description] Deployment description.
 *
 * @returns {Promise<string>} The result of the deployment command.
 */
export const execute = async (args: ARGS): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const auth = args.token || (await getToken());
    const github = new Octokit({ auth });
    const owner = (args.owner || (await getOwner()))!;
    const repo = (args.repo || (await getRepo()))!;
    const ref = (args.ref || (await getCommit()))!;
    const environment = args.environment || 'staging';

    /* https://octokit.github.io/rest.js/v17#repos-create-deployment */
    const deployment = await github.repos.createDeployment({
      owner,
      repo,
      ref,
      environment,
      description: args.description,
      required_contexts: [],
      transient_environment: environment !== 'production'
    });

    let state: 'success' | 'error';

    try {
      retVal = await args.command();
      state = 'success';
    } catch (error) {
      state = 'error';
    }

    /* https://octokit.github.io/rest.js/v17#repos-create-deployment-status */
    await github.repos.createDeploymentStatus({
      owner,
      repo,
      deployment_id: deployment.data.id,
      state,
      environment_url: retVal,
      environment,
      description: args.description
    });
  } catch (error) {
    console.error(red(error));
  }

  return retVal;
};

export default () => {
  const command = new Command('github-deploy');

  return command
    .description('execute a GitHub deployment')
    .arguments('<command> [args...]')
    .option('-t, --token <token>', 'access token')
    .option('-o, --owner <owner>', 'GitHub repository owner')
    .option('-r, --repo <repo>', 'GitHub repository name')
    .option('-c, --commit <commit>', 'GitHub commit SHA')
    .option('-p, --production', 'production deploy')
    .option('-m, --message <message>', 'deployment message')
    .action(async (subcommand, args) => {
      const url = await execute({
        command: async () => {
          let retVal: string | undefined;

          try {
            const result = await execa(subcommand, args);

            retVal = result.stdout.toString().split('\n').pop();
          } catch (error) {
            console.error(red(error));
            process.exit(1);
          }

          return retVal;
        },
        token: command.token,
        owner: command.owner,
        repo: command.repo,
        ref: command.commit,
        environment: command.production ? 'production' : 'staging',
        description: command.message
      });

      if (url) {
        console.log(url);
      } else {
        console.error(red(`Unable to deploy '${subcommand} ${args}'`));
        process.exit(1);
      }
    });
};
