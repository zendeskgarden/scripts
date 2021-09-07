# `garden cmd-du`

Output disk usage, in bytes, for the given directory.

## Usage

```ts
import { cmdDu } from '@zendeskgarden/scripts';

const KB = 1024;
const SIZES = ['B', 'K', 'M', 'G', 'T'];

(async () => {
  const usage = await cmdDu(dir?: string);
  const index = Math.floor(Math.log(usage) / Math.log(KB));
  const size = (usage / KB ** index).toFixed(1);

  console.log(`${size}${SIZES[index]}`);
})();
```

### Arguments

- `dir` directory to get usage for; defaults to the current directory.

## Command

```sh
garden cmd-du [dir]
```
