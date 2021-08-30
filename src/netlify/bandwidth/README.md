# `garden netlify-bandwidth`

Get the remaining bandwidth for a Netlify site.

## Usage

```ts
import { netlifyBandwidth } from '@zendeskgarden/scripts';

const args: {
  siteId?: string;
  token?: string;
} = {
  /* optional overrides */
};

(async () => {
  const result = await netlifyBandwidth(args);

  if (result) {
    const { available, used } = result;

    console.log(available - used);
  }
})();
```

### Arguments

- `siteId` optional Netlify site API ID; defaults to the value provided by
  [`netlifySiteId`](../site_id#readme).
- `token` optional Netlify personal access token; defaults to the value
  provided by [`netlifyToken`](../token#readme).

## Command

```sh
garden netlify-bandwidth \
       [--id <id>] \
       [--token <token>]
```
