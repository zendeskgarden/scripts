/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

export {
  deployment as githubDeployment,
  deploymentStatus as githubDeploymentStatus,
  pages as githubPages
} from './github';
export { deploy as netlifyDeploy } from './netlify';
