# `garden github-release`

Create a GitHub release.

## Usage

```ts
import { githubRelease } from '@zendeskgarden/tool-shed';

const args: {
  tag: string;
  body: string;
  published?: boolean;
  path?: string;
  token?: string;
} = {
  tag: 'test',
  body: '# Release\n\ncontent...'
  /* optional overrides */
};

(async () => {
  const url = await githubRelease(args);

  console.log(url);
})();
```

### Arguments

- `tag` tag name.
- `body` body markdown content.
- `published` determine whether this is a published or draft release;
  defaults to draft.
- `path` optional path to a git directory; defaults to the current directory.
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token#readme).

## Command

```sh
garden github-release \
       [--tag <tag>] \
       [--published] \
       [--path <path>] \
       [--token <token>] \
       <markdown>
```
