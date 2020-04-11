# `garden github-deploy`

Execute a GitHub
[deployment](https://developer.github.com/v3/repos/deployments/) based on a
`command` that provides a URL (and optional log URL).

## Usage

```ts
import { githubDeploy, netlifyDeploy } from '@zendeskgarden/tool-shed';

const args: {
  command: (...args: any[]) => Promise<string | { url: string; logUrl: string }>;
  environment?: 'staging' | 'production';
  path?: string;
  token?: string;
  ref?: string;
  message?: string;
} = {
  command: async () => {
    const result = await netlifyDeploy({ dir: __dirname });

    return result;
  }
  /* optional overrides */
};

(async () => {
  const url = await githubDeploy(args);

  console.log(url);
})();
```

### Arguments

- `command` deployment command to execute; returns a URL (or `{ url, logUrl }` pair) if successful.
- `environment` optional `'staging'` or `'production'` environment; defaults
  to `'staging'`.
- `path` optional path to a git directory; defaults to the current directory.
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token#readme).
- `ref` optional named branch, tag, or SHA to deploy against; defaults to the
  value provided by [`githubCommit`](../commit#readme).
- `message` optional deployment message.

## Command

```sh
garden github-deploy \
       [--production] \
       [--path <path>] \
       [--token <token>] \
       [--commit <commit>] \
       [--message <message>] \
       <command>
```
