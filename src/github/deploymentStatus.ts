/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Command } from 'commander';
import { Octokit } from '@octokit/rest';

export const execute = (
  token: string,
  owner: string,
  repo: string,
  deploymentId: number,
  state: 'success' | 'pending' | 'error',
  url: string,
  logUrl?: string,
  environment?: 'production' | 'staging',
  description?: string
) => {
  const github = new Octokit({ auth: token });

  return github.repos.createDeploymentStatus({
    owner,
    repo,
    deployment_id: deploymentId,
    state,
    environment_url: url,
    log_url: logUrl,
    environment,
    description
  });
};

async function action(command: Command) {
  try {
    const response = await execute(
      command.token,
      command.owner,
      command.repo,
      command.id,
      command.state,
      command.url,
      command.log_url,
      command.env,
      command.desc
    );

    console.log(response.data.id);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default () => {
  const command = new Command('github-deployment-status');
  let ownerDefault;
  let repoDefault;

  if (process.env.TRAVIS_REPO_SLUG) {
    [ownerDefault, repoDefault] = process.env.TRAVIS_REPO_SLUG.split('/');
  } else {
    ownerDefault = process.env.CIRCLE_PROJECT_USERNAME;
    repoDefault = process.env.CIRCLE_PROJECT_REPONAME;
  }

  return command
    .requiredOption('-t, --token <token>', 'access token', process.env.GITHUB_TOKEN)
    .requiredOption('-o, --owner <owner>', 'github owner', ownerDefault)
    .requiredOption('-r, --repo <repo>', 'github repo', repoDefault)
    .requiredOption('-i, --id <id>', 'deployment ID')
    .requiredOption('-s, --state <state>', 'state (success, pending, error)')
    .requiredOption('-u, --url <url>', 'deployment URL')
    .option('-l, --log [log]', 'deployment log URL')
    .option('-e, --env [env]', 'environment (staging, production)')
    .option('-d, --desc [desc]', 'deployment status description')
    .action((_command: Command) => {
      action(_command);
    });
};
