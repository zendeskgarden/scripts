# `garden github-commit`

The latest commit SHA provided by a CI environment or remote GitHub
repository and branch.

## Usage

```ts
import { githubCommit } from '@zendeskgarden/tool-shed';

const args: {
  path?: string;
  branch?: string;
  token?: string;
} = {
  /* optional overrides */
};

(async () => {
  const commit = await githubCommit(args);

  console.log(commit);
})();
```

### Arguments

- `path` optional path to a git directory; defaults to the current directory.
- `branch` optional GitHub branch name; defaults to the value provided by
  [`githubBranch`](../branch).
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token).

## Command

```sh
garden github-commit [--branch <branch>] [--token <token>] [path]
```
