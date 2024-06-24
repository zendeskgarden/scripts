# `garden github-teams`

Get a list of GitHub organization teams.

## Usage

```ts
import { githubTeams } from '@zendeskgarden/scripts';

(async () => {
  const teams = await githubTeams();

  console.log(teams && teams.join(', '));
})();
```

### Arguments

- `org` GitHub organization name; defaults to the owner provided by
  [`githubRepository`](../repository#readme).
- `user` user to get team membership for; defaults to the current user.
- `path` optional path to a git directory; defaults to the current directory.
- `token` optional GitHub personal access token; defaults to the value
  provided by [`githubToken`](../token#readme).

## Command

```sh
garden github-teams \
       [--user [user]] \
       [--path <path>] \
       [--token <token>] \
       <org>
```
