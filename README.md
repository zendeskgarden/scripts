# Garden Tool Shed [![Build Status][build status badge]][build status link] [![Dependency Status][dependency status badge]][dependency status link]<!-- markdownlint-disable -->

<!-- markdownlint-enable -->

[build status badge]: https://flat.badgen.net/circleci/github/zendeskgarden/tool-shed/master?label=build
[build status link]: https://circleci.com/gh/zendeskgarden/tool-shed/tree/master
[dependency status badge]: https://flat.badgen.net/david/dev/zendeskgarden/tool-shed?label=dependencies
[dependency status link]: https://david-dm.org/zendeskgarden/tool-shed?type=dev

> :seedling: Garden is a design system for Zendesk

This repo contains a set of CLI scripts leveraged throughout the Garden
repositories for common tasks and CI automation.

## Installation

```sh
npm install --save-dev @zendeskgarden/tool-shed
```

... or for one-off execution

```sh
npx -p @zendeskgarden/tool-shed garden [command]
```

## Usage

All commands are available via the `garden` executable. Commands may be
chained so that the output from one command provides input to another. Each
command also provides a functional equivalent for programmatic usage. See
the individual command README for details:

- [`garden github-branch`](src/github/branch)
- [`garden github-commit`](src/github/commit)
- [`garden github-deploy`](src/github/deploy)
- [`garden github-owner`](src/github/owner)
- [`garden github-pages`](src/github/pages)
- [`garden github-repo`](src/github/repo)
- [`garden github-token`](src/github/token)
- [`garden netlify-deploy`](src/netlify/deploy)
- [`garden netlify-site-id`](src/netlify/site_id)
- [`garden netlify-token`](src/netlify/token)

## Contribution

Thanks for your interest in Garden! Community involvement helps make our
design system fresh and tasty for everyone.

Got issues with what you find here? Please feel free to create an
[issue](https://github.com/zendeskgarden/tool-shed/issues/new).

Community behavior is benevolently ruled by a [code of
conduct](.github/CODE_OF_CONDUCT.md). Please participate accordingly.

## License

Copyright 2020 Zendesk

Licensed under the [Apache License, Version 2.0](LICENSE.md)
