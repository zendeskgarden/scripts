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
  command: (...args: unknown[]) => Promise<string | { url: string; logUrl: string } | undefined>;
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
    let error;

    try {
      result = await args.command();
    } catch (err: unknown) {
      error = err;
    }

    /* https://octokit.github.io/rest.js/v17#repos-create-deployment-status */
    await github.repos.createDeploymentStatus({
      owner: repository.owner,
      repo: repository.repo,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      deployment_id: (deployment.data as any).id, // HACK for types broken in oktokit 17.9.1
      state: error ? 'error' : 'success',
      environment_url: typeof result === 'object' ? result.url : result,
      log_url: typeof result === 'object' ? result.logUrl : undefined,
      environment,
      description: args.message
    });

    if (error) {
      throw error;
    }

    retVal = typeof result === 'object' ? result.url : result;
  } catch (error: unknown) {
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
    .action(async (subcommand: string, args: string[]) => {
      try {
        spinner.start();

        const options = command.opts();
        const url = await execute({
          command: async () => {
            let retVal: string | undefined;

            try {
              const result = await execa(subcommand, args);

              retVal = result.stdout.toString();
            } catch (error: unknown) {
              handleErrorMessage(error, subcommand, spinner);
              throw error;
            }

            return retVal;
          },
          path: options.path,
          production: options.production,
          token: options.token,
          ref: options.commit,
          message: options.message,
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
