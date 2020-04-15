# `garden github-repository`

Get the current GitHub repository name provided by a CI environment or extracted
from a git repository.

## Usage

```ts
import { githubRepository } from '@zendeskgarden/scripts';

(async () => {
  const repository = await githubRepository(path?: string);

  if (repository) {
    const { owner, repo } = repository;

    console.log(`${owner}/${repo}`);
  }
})();
```

### Arguments

- `path` optional path to a git directory; defaults to the current directory.

## Command

```sh
garden github-repository [path]
```
