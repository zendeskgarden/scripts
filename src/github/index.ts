/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { execute as branch, default as branchCommand } from './branch/index.js';
import { execute as commit, default as commitCommand } from './commit/index.js';
import { execute as deploy, default as deployCommand } from './deploy/index.js';
import { execute as membership, default as membershipCommand } from './membership/index.js';
import { execute as pages, default as pagesCommand } from './pages/index.js';
import { execute as release, default as releaseCommand } from './release/index.js';
import { execute as repository, default as repositoryCommand } from './repository/index.js';
import { execute as teams, default as teamsCommand } from './teams/index.js';
import { execute as token, default as tokenCommand } from './token/index.js';

const commands = {
  branchCommand,
  commitCommand,
  deployCommand,
  membershipCommand,
  pagesCommand,
  releaseCommand,
  repositoryCommand,
  teamsCommand,
  tokenCommand
};

export {
  commands as default,
  branch,
  branchCommand,
  commit,
  commitCommand,
  deploy,
  deployCommand,
  membership,
  membershipCommand,
  pages,
  pagesCommand,
  release,
  releaseCommand,
  repository,
  repositoryCommand,
  teams,
  teamsCommand,
  token,
  tokenCommand
};
