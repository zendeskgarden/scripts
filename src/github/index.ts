/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

export { default as deploymentCommand, execute as deployment } from './deployment';
export {
  default as deploymentStatusCommand,
  execute as deploymentStatus
} from './deploymentStatus';
export { default as branchCommand, execute as branch } from './branch';
export { default as commitCommand, execute as commit } from './commit';
export { default as ownerCommand, execute as owner } from './owner';
export { default as pagesCommand, execute as pages } from './pages';
export { default as repoCommand, execute as repo } from './repo';
export { default as tokenCommand, execute as token } from './token';
