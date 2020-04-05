/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Command } from 'commander';
import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

export const execute = (
  token: string,
  ref: string,
  owner?: string,
  repo?: string,
  environment?: 'staging' | 'production',
  description?: string
) => {
  const github = new Octokit({ auth: token });

  return github.repos.createDeployment({
    owner: owner || 'zendeskgarden',
    repo: repo || execSync('basename `git rev-parse --show-toplevel`').toString(),
    ref,
    environment,
    description,
    required_contexts: [],
    transient_environment: (environment && environment !== 'production') || undefined
  });
};

export default () => {
  const command = new Command('github-deployment');
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
    .requiredOption(
      '-c, --commit <commit>',
      'commit SHA or ref to deploy',
      process.env.CIRCLE_SHA1 || process.env.TRAVIS_COMMIT
    )
    .option('-o, --owner [owner]', 'github owner', ownerDefault)
    .option('-r, --repo [repo]', 'github repo', repoDefault)
    .option('-e, --env [env]', 'environment (staging, production)')
    .option('-d, --desc [desc]', 'deployment description')
    .action(async function action() {
      try {
        const response = await execute(
          command.token,
          command.commit,
          command.owner,
          command.repo,
          command.env,
          command.desc
        );

        console.log(response.data.id);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });
};
