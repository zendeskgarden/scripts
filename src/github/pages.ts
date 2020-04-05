/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Command } from 'commander';
import { execSync } from 'child_process';
import { publish } from 'gh-pages';

export const execute = (
  token: string,
  dir: string,
  owner?: string,
  repo?: string,
  message?: string
) => {
  publish(dir, {
    repo: `https://${token}@github.com/${owner || 'zendeskgarden'}/${
      repo || execSync('basename `git rev-parse --show-toplevel`')
    }.git`,
    user: {
      name: 'Zendesk Garden',
      email: 'garden@zendesk.com'
    },
    message: message || 'Updates [skip ci]',
    silent: true
  });
};

export default () => {
  const command = new Command('github-pages');
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
    .requiredOption('-d, --dir <dir>', 'folder to publish')
    .option('-o, --owner [owner]', 'github owner', ownerDefault)
    .option('-r, --repo [repo]', 'github repo', repoDefault)
    .option('-m, --message [message]', 'deploy message')
    .action(() => {
      try {
        execute(command.token, command.dir, command.owner, command.repo, command.message);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });
};
