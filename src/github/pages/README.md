# `garden github-pages`

Publish the given directory to a `gh-pages` branch.

## Usage

```ts
import { githubPages } from '@zendeskgarden/scripts';

const args: {
  dir: string;
  path?: string;
  message?: string;
  token?: string;
} = {
  dir: __dirname
  /* optional overrides */
};

(async () => {
  const url = await githubPages(args);

  console.log(url);
})();
```

### Arguments

- `dir` directory of web content to publish.
- `path` optional path to a git directory; defaults to `dir`.
- `message` optional commit message.
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token#readme).

## Command

```sh
garden github-pages [--path <path>] [--message <message>] [--token <token>] <dir>
```

To get debug output:

```sh
NODE_DEBUG=gh-pages garden github-pages
```
