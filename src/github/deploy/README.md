# `garden github-deploy`

Execute a GitHub
[deployment](https://developer.github.com/v3/repos/deployments/) based on a
`command` that provides a URL (and optional log URL).

## Usage

```ts
import { githubDeploy, netlifyDeploy } from '@zendeskgarden/scripts';

const args: {
  command: (...args: any[]) => Promise<string | { url: string; logUrl: string }>;
  production?: boolean;
  path?: string;
  token?: string;
  ref?: string;
  message?: string;
} = {
  command: async () => {
    const result = await netlifyDeploy({
      dir: __dirname,
      production: args.production,
      token: args.token,
      message: args.message
    });

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
- `production` determine whether this is a production or staging deployment;
  defaults to staging.
- `path` optional path to a git directory; defaults to the current directory.
- `ref` optional named branch, tag, or SHA to deploy against; defaults to the
  value provided by [`githubCommit`](../commit#readme).
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token#readme).
- `message` optional deployment message.

## Command

```sh
garden github-deploy \
       [--production] \
       [--path <path>] \
       [--commit <commit>] \
       [--token <token>] \
       [--message <message>] \
       <command>
```
