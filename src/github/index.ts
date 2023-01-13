/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { execute as branch, default as branchCommand } from './branch/index.js';
import { execute as commit, default as commitCommand } from './commit/index.js';
import { execute as deploy, default as deployCommand } from './deploy/index.js';
import { execute as pages, default as pagesCommand } from './pages/index.js';
import { execute as release, default as releaseCommand } from './release/index.js';
import { execute as repository, default as repositoryCommand } from './repository/index.js';
import { execute as token, default as tokenCommand } from './token/index.js';

const commands = {
  branchCommand,
  commitCommand,
  deployCommand,
  pagesCommand,
  releaseCommand,
  repositoryCommand,
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
  pages,
  pagesCommand,
  release,
  releaseCommand,
  repository,
  repositoryCommand,
  token,
  tokenCommand
};
