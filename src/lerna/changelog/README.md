# `garden lerna-changelog`

Generate a multi-repo markdown log of changes between two tags.

## Usage

```ts
import { lernaChangelog } from '@zendeskgarden/tool-shed';

const args: {
  from?: string;
  to?: string;
  token?: string;
  path?: string;
} = {
  /* optional overrides */
};

(async () => {
  const markdown = await lernaChangelog(args);

  console.log(markdown);
})();
```

### Arguments

- `from` optional tag or SHA; defaults to the current tag.
- `to` optional tag or SHA; defaults to the previous tag.
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token#readme).
- `path` optional path to a git directory; defaults to the current directory.

## Command

```sh
garden lerna-changelog \
       [--from <from-tag>] \
       [--to <to-tag>] \
       [--token <token>] \
       [path]
```
