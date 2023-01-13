# `garden lerna-new`

Generate a new Lerna package based on a template source directory. All source
file names and content are evaluated for [Handlebars](https://handlebarsjs.com/)
(with registered [helpers](https://github.com/helpers/handlebars-helpers)) tag
expressions. The following custom helpers are also available:

- `kebabcase` – convert string to [kebab case](https://lodash.com/docs#kebabCase)
- `pluralize` – convert word to plural form
- `singularize` – convert word to singular form
- `snakecase` – convert string to [snake case](https://lodash.com/docs#snakeCase)
- `startcase` – convert string to [start case](https://lodash.com/docs#startCase)

## Usage

```ts
import { lernaNew } from '@zendeskgarden/scripts';
import { tmpdir } from 'os';

const args: {
  src: string;
  dest: string;
  tags?: Record<string, string>;
} = {
  src: __dirname,
  dest: tmpdir()
  /* optional overrides */
};

(async () => {
  const result = await lernaNew(args);

  if (result) {
    const { src, dest } = result;

    console.log(src, dest);
  }
})();
```

### Arguments

- `src` template source directory.
- `dest` package destination directory.
- `tag` &lt;name&gt;=&lt;value&gt; tags for template substitution.

## Command

```sh
garden lerna-new [--tag <tags...>] <src> <dest>
```
