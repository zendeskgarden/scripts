# `garden netlify-token`

Get the current Netlify personal access token provided by the `NETLIFY_TOKEN`
environment variable or the value of the `netlify.token` git configuration
option.

## Usage

```ts
import { netlifyToken } from '@zendeskgarden/scripts';

(async () => {
  const token = await netlifyToken();

  console.log(token && token.replace(/./gu, '*'));
})();
```

## Command

```sh
garden netlify-token [--no-mask]
```
