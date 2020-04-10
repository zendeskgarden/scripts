/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { commit as getCommit, owner as getOwner, repo as getRepo, token as getToken } from '..';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import { Octokit } from '@octokit/rest';
import { Ora } from 'ora';
import execa from 'execa';

type ARGS = {
  command: (...args: any[]) => Promise<string | { url: string; logUrl: string } | undefined>;
  path?: string;
  token?: string;
  owner?: string;
  repo?: string;
  ref?: string;
  environment?: 'staging' | 'production';
  description?: string;
  spinner?: Ora;
};

/**
 * Execute the `github-deploy` command.
 *
 * @param {function} args.command Deployment command to execute.
 * @param {string} [args.path] Path to a git directory.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.owner] GitHub repo owner.
 * @param {string} [args.repo] GitHub repo name.
 * @param {string} [args.ref] GitHub ref (commit SHA, branch, tag).
 * @param {string} [args.environment] Deployment environment.
 * @param {string} [args.description] Deployment description.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The result of the deployment command.
 */
export const execute = async (args: ARGS): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const auth = args.token || (await getToken(args.spinner));
    const github = new Octokit({ auth });
    const owner = (args.owner || (await getOwner(args.path, args.spinner)))!;
    const repo = (args.repo || (await getRepo(args.path, args.spinner)))!;
    const ref = (args.ref || (await getCommit({ ...args })))!;
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

    let result;
    let state: 'success' | 'error';

    try {
      result = await args.command();
      state = 'success';
    } catch (error) {
      handleErrorMessage(error, 'github-deploy', args.spinner);
      state = 'error';
    }

    /* https://octokit.github.io/rest.js/v17#repos-create-deployment-status */
    await github.repos.createDeploymentStatus({
      owner,
      repo,
      deployment_id: deployment.data.id,
      state,
      environment_url: typeof result === 'object' ? result.url : result,
      log_url: typeof result === 'object' ? result.logUrl : undefined,
      environment,
      description: args.description
    });

    retVal = typeof result === 'object' ? result.url : result;
  } catch (error) {
    handleErrorMessage(error, 'github-deploy', args.spinner);
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('github-deploy');

  return command
    .description('execute a GitHub deployment based on a <command> that outputs a URL')
    .arguments('<command> [args...]')
    .option('-p, --path <path>', 'git directory')
    .option('-t, --token <token>', 'access token')
    .option('-o, --owner <owner>', 'GitHub repository owner')
    .option('-r, --repo <repo>', 'GitHub repository name')
    .option('-c, --commit <commit>', 'GitHub commit SHA')
    .option('-p, --production', 'production deploy')
    .option('-m, --message <message>', 'deployment message')
    .action(async (subcommand, args) => {
      try {
        spinner.start();

        const url = await execute({
          command: async () => {
            let retVal: string | undefined;

            try {
              const result = await execa(subcommand, args);

              retVal = result.stdout.toString();
            } catch (error) {
              handleErrorMessage(error, subcommand, spinner);
              process.exit(1);
            }

            return retVal;
          },
          path: command.path,
          token: command.token,
          owner: command.owner,
          repo: command.repo,
          ref: command.commit,
          environment: command.production ? 'production' : 'staging',
          description: command.message,
          spinner
        });

        if (url) {
          handleSuccessMessage(url, spinner);
        } else {
          const cmd = args.length > 0 ? `${subcommand} ${args.join(' ')}` : subcommand;

          spinner.fail(`Unable to deploy '${cmd}'`);
          process.exit(1);
        }
      } finally {
        spinner.stop();
      }
    });
};
