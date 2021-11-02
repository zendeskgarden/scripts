# `garden cmd-docgen`

Generate component documentation from the given paths.

## Usage

```ts
import { cmdDocgen } from '@zendeskgarden/scripts';

const args: {
  paths: string[] | string;
  extensions?: string[];
  ignore?: string[];
} = {
  paths: __dirname
  /* optional overrides */
};

(async () => {
  const result = await cmdDocgen(args);

  console.log(JSON.stringify(result, undefined, 2));
})();
```

### Arguments

- `paths` one or more component path globs.
- `extensions` file extensions to consider (default: ["js","jsx","ts","tsx"]).
- `ignore` paths to ignore (default: ["**/*.spec.*","**/dist/**","**/node_modules/**"]).

## Command

```sh
garden cmd-docgen \
       [--extensions <extensions>] \
       [--ignore <ignore>] \
       [--pretty] \
       <paths>
```
