# `garden lerna-config`

Get the Lerna configuration for a git repository.

## Usage

```ts
import { lernaConfig } from '@zendeskgarden/scripts';

(async () => {
  const config = await lernaConfig(path?: string);

  console.log(JSON.stringify(config));
})();
```

### Arguments

- `path` optional path to a git directory; defaults to the current directory.

## Command

```sh
garden lerna-config [path]
```
