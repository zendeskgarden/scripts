/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

export {
  branch as githubBranch,
  commit as githubCommit,
  deploy as githubDeploy,
  pages as githubPages,
  release as githubRelease,
  repository as githubRepository,
  token as githubToken
} from './github';
export { deploy as netlifyDeploy, siteId as netlifySiteId, token as netlifyToken } from './netlify';
