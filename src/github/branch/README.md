# `garden github-branch`

Get the current GitHub branch name provided by a CI environment or extracted
from a git repository.

## Usage

```ts
import { githubBranch } from '@zendeskgarden/scripts';

(async () => {
  const branch = await githubBranch(path?: string);

  console.log(branch);
})();
```

### Arguments

- `path` optional path to a git directory; defaults to the current directory.

## Command

```sh
garden github-branch [path]
```
