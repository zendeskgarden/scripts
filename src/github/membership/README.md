# `garden github-membership`

Manage GitHub organization [membership](https://docs.github.com/en/rest/orgs/members).

## Usage

```ts
import { githubMembership } from '@zendeskgarden/scripts';

const args: {
  org?: string;
  users?: string[];
  path?: string;
  token?: string;
} = {
  /* optional overrides */
};

(async () => {
  const { success, failure } = await githubRelease(args);

  console.log(success, failure);
})();
```

### Arguments

- `org` optional GitHub organization name; defaults to repository owner.
- `delete` optional list of members to remove.
- `list` determine if output should be listed; defaults to a numeric summary.
- `path` optional path to a git directory; defaults to the current directory.
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token#readme).

## Command

```sh
garden github-membership \
       [--org [org]] \
       [--delete <users...>] \
       [--path <path>] \
       [--token <token>]
```
