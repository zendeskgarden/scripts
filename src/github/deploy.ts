/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { owner as getOwner, repo as getRepo, token as getToken } from '.';
import { Command } from 'commander';
import { Octokit } from '@octokit/rest';

export const execute = async (
  command: () => Promise<string>,
  ref: string,
  token?: string,
  owner?: string,
  repo?: string,
  environment?: 'staging' | 'production',
  description?: string
) => {
  const auth = token || (await getToken());
  const github = new Octokit({ auth });
  const _owner = owner || (await getOwner());
  const _repo = repo || (await getRepo());
  const _environment = environment || 'staging';

  /* https://octokit.github.io/rest.js/v17#repos-create-deployment */
  const deployment = await github.repos.createDeployment({
    owner: _owner,
    repo: _repo,
    ref,
    environment: _environment,
    description,
    required_contexts: [],
    transient_environment: environment !== 'production'
  });

  let state: 'success' | 'error';
  let url;

  try {
    url = await command();
    state = 'success';
  } catch (error) {
    state = 'error';
  }

  /* https://octokit.github.io/rest.js/v17#repos-create-deployment-status */
  const deploymentStatus = await github.repos.createDeploymentStatus({
    owner: _owner,
    repo: _repo,
    deployment_id: deployment.data.id,
    state,
    environment_url: url,
    environment: _environment,
    description
  });
};
