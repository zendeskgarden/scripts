# `garden github-token`

Get the current GitHub personal access token provided by the `GITHUB_TOKEN`
environment variable or the value of the `github.token` git configuration
option.

## Usage

```ts
import { githubToken } from '@zendeskgarden/scripts';

(async () => {
  const token = await githubToken();

  console.log(token && token.replace(/./gu, '*'));
})();
```

## Command

```sh
garden github-token [--no-mask]
```
