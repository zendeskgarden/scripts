/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { commit as getCommit, repository as getRepository, token as getToken } from '..';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Octokit } from '@octokit/rest';
import { Ora } from 'ora';
import execa from 'execa';

interface IGitHubDeployArgs {
  command: (...args: any[]) => Promise<string | { url: string; logUrl: string } | undefined>;
  path?: string;
  production?: boolean;
  token?: string;
  ref?: string;
  message?: string;
  spinner?: Ora;
}

/**
 * Execute the `github-deploy` command.
 *
 * @param {function} args.command Deployment command to execute.
 * @param {string} [args.path] Path to a git directory.
 * @param {boolean} [args.production] Determine whether this is a production deployment.
 * @param {string} [args.token] GitHub personal access token.
 * @param {string} [args.ref] GitHub ref (commit SHA, branch, tag).
 * @param {string} [args.message] Deployment message.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The result of the deployment command.
 */
export const execute = async (args: IGitHubDeployArgs): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    const auth = args.token || (await getToken(args.spinner));
    const github = new Octokit({ auth });
    const repository = (await getRepository(args.path, args.spinner))!;
    const ref = (args.ref || (await getCommit({ ...args })))!;
    const environment = args.production ? 'production' : 'staging';

    /* https://octokit.github.io/rest.js/v17#repos-create-deployment */
    const deployment = await github.repos.createDeployment({
      owner: repository.owner,
      repo: repository.repo,
      ref,
      environment,
      description: args.message,
      auto_merge: false,
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
      owner: repository.owner,
      repo: repository.repo,
      deployment_id: (deployment.data as any).id, // HACK for types broken in oktokit 17.9.1
      state,
      environment_url: typeof result === 'object' ? result.url : result,
      log_url: typeof result === 'object' ? result.logUrl : undefined,
      environment,
      description: args.message
    });

    retVal = typeof result === 'object' ? result.url : result;
  } catch (error) {
    handleErrorMessage(error, 'github-deploy', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('github-deploy');

  return command
    .description('execute a GitHub deployment based on a <command> that outputs a URL')
    .arguments('<command> [args...]')
    .option('-p, --production', 'production deployment')
    .option('-d, --path <path>', 'git directory')
    .option('-c, --commit <commit>', 'GitHub commit SHA')
    .option('-t, --token <token>', 'access token')
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
              throw error;
            }

            return retVal;
          },
          path: command.path,
          production: command.production,
          token: command.token,
          ref: command.commit,
          message: command.message,
          spinner
        });

        if (url) {
          handleSuccessMessage(url, spinner);
        } else {
          throw new Error();
        }
      } catch {
        const cmd = args.length > 0 ? `${subcommand} ${args.join(' ')}` : subcommand;

        spinner.fail(`Unable to deploy '${cmd}'`);
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
