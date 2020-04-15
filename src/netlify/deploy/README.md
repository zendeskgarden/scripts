# `garden netlify-deploy`

Deploy the given directory to a [Netlify](https://www.netlify.com/) site.

## Usage

```ts
import { netlifyDeploy } from '@zendeskgarden/scripts';

const args: {
  dir: string;
  production?: boolean;
  siteId?: string;
  token?: string;
  message?: string;
} = {
  dir: __dirname
  /* optional overrides */
};

(async () => {
  const result = await netlifyDeploy(args);

  if (result) {
    const { url, logUrl } = result;

    console.log(url, logUrl);
  }
})();
```

### Arguments

- `dir` directory of content to deploy.
- `production` determine whether this is a production or draft deploy;
  defaults to draft.
- `siteId` optional Netlify site API ID; defaults to the value provided by
  [`netlifySiteId`](../site_id#readme).
- `token` optional Netlify personal access token; defaults to the value
  provided by [`netlifyToken`](../token#readme).
- `message` optional deployment message.

## Command

```sh
garden netlify-deploy \
       [--production] \
       [--id <id>] \
       [--token <token>] \
       [--message <message>] \
       <dir>
```
