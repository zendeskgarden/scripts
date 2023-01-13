/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { execute as bandwidth, default as bandwidthCommand } from './bandwidth/index.js';
import { execute as deploy, default as deployCommand } from './deploy/index.js';
import { execute as siteId, default as siteIdCommand } from './site_id/index.js';
import { execute as token, default as tokenCommand } from './token/index.js';

const commands = { bandwidthCommand, deployCommand, siteIdCommand, tokenCommand };

export {
  commands as default,
  bandwidth,
  bandwidthCommand,
  deploy,
  deployCommand,
  siteId,
  siteIdCommand,
  token,
  tokenCommand
};
