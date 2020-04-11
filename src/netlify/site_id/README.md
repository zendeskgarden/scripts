# `garden netlify-site-id`

Get the current Netlify site API ID provided by the `NETLIFY_SITE_ID`
environment variable or the value of the `netlify.siteid` git configuration
option.

## Usage

```ts
import { netlifySiteId } from '@zendeskgarden/tool-shed';

(async () => {
  const siteId = await netlifySiteId();

  console.log(siteId);
})();
```

## Command

```sh
garden netlify-site-id
```
