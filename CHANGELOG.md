# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.5.0](https://github.com/zendeskgarden/scripts/compare/v2.4.5...v2.5.0) (2025-11-11)


### Features

* new `github-membership` script ([#314](https://github.com/zendeskgarden/scripts/issues/314)) ([2dfadd8](https://github.com/zendeskgarden/scripts/commit/2dfadd880188978e9297781b1a03d2d867e99c3f))

## [2.4.5](https://github.com/zendeskgarden/scripts/compare/v2.4.4...v2.4.5) (2025-11-04)


### Bug Fixes

* **netlify-deploy:** simplify API usage ([#312](https://github.com/zendeskgarden/scripts/issues/312)) ([8d99880](https://github.com/zendeskgarden/scripts/commit/8d998801f5902fb4b8d18b7602479ae0ef08d1ed))

## [2.4.4](https://github.com/zendeskgarden/scripts/compare/v2.4.3...v2.4.4) (2025-10-29)


### Bug Fixes

* **deps:** update all non-major dependencies ([#259](https://github.com/zendeskgarden/scripts/issues/259)) ([6426e65](https://github.com/zendeskgarden/scripts/commit/6426e65c34ec10502689011dbe55ec987af2a0a0))
* **deps:** update dependency @octokit/request-error to v6.1.7 [security] ([#276](https://github.com/zendeskgarden/scripts/issues/276)) ([5c7875f](https://github.com/zendeskgarden/scripts/commit/5c7875fa82640a4bc9d96ed5b1dbbbe8061f0407))
* **deps:** update dependency commander to v14 ([#288](https://github.com/zendeskgarden/scripts/issues/288)) ([c19a1b4](https://github.com/zendeskgarden/scripts/commit/c19a1b4b4df20c04c8e48c43e22f5c9cfcdaa92a))
* **deps:** update dependency dotenv to v17 ([#289](https://github.com/zendeskgarden/scripts/issues/289)) ([66cf2b1](https://github.com/zendeskgarden/scripts/commit/66cf2b1fac3aff3f729a986201cdc6fdb78fce57))
* **deps:** update dependency globby to v15 ([#303](https://github.com/zendeskgarden/scripts/issues/303)) ([dd46f55](https://github.com/zendeskgarden/scripts/commit/dd46f55581ac203cd14ce07b32f37acf7f029468))
* **deps:** update dependency netlify to v23 ([#294](https://github.com/zendeskgarden/scripts/issues/294)) ([83805a3](https://github.com/zendeskgarden/scripts/commit/83805a3bb39b926f53f0d0adc2295c01812596df))
* **deps:** update dependency netlify-cli to v23 ([#295](https://github.com/zendeskgarden/scripts/issues/295)) ([3b239c9](https://github.com/zendeskgarden/scripts/commit/3b239c9801ef18096c8a80f1305d402c75d3028d))
* **deps:** update dependency ora to v9 ([#304](https://github.com/zendeskgarden/scripts/issues/304)) ([ad46f7c](https://github.com/zendeskgarden/scripts/commit/ad46f7c86e0918b36221312043a5b3e9c41b9c78))
* **deps:** update octokit monorepo (major) ([#292](https://github.com/zendeskgarden/scripts/issues/292)) ([271a919](https://github.com/zendeskgarden/scripts/commit/271a919520ca68c2fdc5b5a32ae600ea75e8a15d))

## [2.4.3](https://github.com/zendeskgarden/scripts/compare/v2.4.2...v2.4.3) (2024-11-05)


### Bug Fixes

* **cmd-docgen:** check for `undefined` default value ([#235](https://github.com/zendeskgarden/scripts/issues/235)) ([2477e11](https://github.com/zendeskgarden/scripts/commit/2477e118e6e6c480de0bb4b2debbe925f7e214c8))

## [2.4.2](https://github.com/zendeskgarden/scripts/compare/v2.4.1...v2.4.2) (2024-09-10)


### Bug Fixes

* **netlify-deploy:** ensure `--cwd` parameter works as expected with the latest `netlify-cli` ([#233](https://github.com/zendeskgarden/scripts/issues/233)) ([811d1fb](https://github.com/zendeskgarden/scripts/commit/811d1fbada10f9422b3962b54d48ef40e2e102c2))

### [2.4.1](https://github.com/zendeskgarden/scripts/compare/v2.4.0...v2.4.1) (2024-07-12)


### Bug Fixes

* **deps:** update dependency @octokit/rest to v21 ([#226](https://github.com/zendeskgarden/scripts/issues/226)) ([10e22c7](https://github.com/zendeskgarden/scripts/commit/10e22c773f358c89e8326fb3ede051435e8349bf))
* **deps:** update dependency execa to v9 ([#227](https://github.com/zendeskgarden/scripts/issues/227)) ([f253f31](https://github.com/zendeskgarden/scripts/commit/f253f311afed3a4476dfc013088bd91712480699))
* get commit SHA from API rather than GITHUB_SHA ([#228](https://github.com/zendeskgarden/scripts/issues/228)) ([c869522](https://github.com/zendeskgarden/scripts/commit/c86952265438d69e67cf72ea53f1c88b24c67811))

## [2.4.0](https://github.com/zendeskgarden/scripts/compare/v2.3.0...v2.4.0) (2024-06-27)


### Features

* **github-branch, github-commit:** add support for GHA env variables ([#219](https://github.com/zendeskgarden/scripts/issues/219)) ([cb50eef](https://github.com/zendeskgarden/scripts/commit/cb50eefb3c8de0b1f7b0e75506e714dc1d030d1d))

## [2.3.0](https://github.com/zendeskgarden/scripts/compare/v2.2.0...v2.3.0) (2024-06-27)


### Features

* **github-pages:** add option for disabling Jekyll deployments ([#218](https://github.com/zendeskgarden/scripts/issues/218)) ([9397e82](https://github.com/zendeskgarden/scripts/commit/9397e823e8e60dac545d2f00a49e34744fe73869))

## [2.2.0](https://github.com/zendeskgarden/scripts/compare/v2.1.0...v2.2.0) (2024-06-25)


### Features

* new `github-teams` script ([#216](https://github.com/zendeskgarden/scripts/issues/216)) ([e3f1662](https://github.com/zendeskgarden/scripts/commit/e3f16621d1172ee3a34ab7f168fc8557706105ad))

## [2.1.0](https://github.com/zendeskgarden/scripts/compare/v2.0.4...v2.1.0) (2024-06-17)


### Features

* **githubRepository:** support Github Actions env vars to return owner + repo values ([#215](https://github.com/zendeskgarden/scripts/issues/215)) ([c353eba](https://github.com/zendeskgarden/scripts/commit/c353eba7c6fd2403e7b353e849e3d2bb20dbf92f))


### Bug Fixes

* **deps:** update dependency @octokit/request-error to v6 ([#206](https://github.com/zendeskgarden/scripts/issues/206)) ([c13a9b5](https://github.com/zendeskgarden/scripts/commit/c13a9b5a64c3dd4ce8cf98de32922d9c0eea1ad6))
* **deps:** update dependency commander to v12 ([#207](https://github.com/zendeskgarden/scripts/issues/207)) ([8bfb294](https://github.com/zendeskgarden/scripts/commit/8bfb294f62c806be746e2817cf74ab38a90144cd))
* **deps:** update dependency ora to v8 ([#200](https://github.com/zendeskgarden/scripts/issues/200)) ([df49a66](https://github.com/zendeskgarden/scripts/commit/df49a66be69f6e6f7836cbaca1624a6b36463d97))

### [2.0.4](https://github.com/zendeskgarden/scripts/compare/v2.0.3...v2.0.4) (2023-11-20)


### Bug Fixes

* **netlify-deploy:** prevent monorepo sites prompt ([#196](https://github.com/zendeskgarden/scripts/issues/196)) ([a9f1523](https://github.com/zendeskgarden/scripts/commit/a9f1523c3a3aa1ffd940c0f8a7f9471a21069538))

### [2.0.3](https://github.com/zendeskgarden/scripts/compare/v2.0.2...v2.0.3) (2023-11-16)


### Bug Fixes

* **deps:** update dependency globby to v14 ([#194](https://github.com/zendeskgarden/scripts/issues/194)) ([5090992](https://github.com/zendeskgarden/scripts/commit/5090992686364b820aa154423856ad1602df8dd8))
* **deps:** update dependency netlify-cli to v17 ([#195](https://github.com/zendeskgarden/scripts/issues/195)) ([547bdc6](https://github.com/zendeskgarden/scripts/commit/547bdc682c9545bf0c8ba6902ebcb42781df572c))

### [2.0.2](https://github.com/zendeskgarden/scripts/compare/v2.0.1...v2.0.2) (2023-09-22)


### Bug Fixes

* **deps:** update dependency execa to v8 ([#184](https://github.com/zendeskgarden/scripts/issues/184)) ([7dc19a8](https://github.com/zendeskgarden/scripts/commit/7dc19a880f8a8f551243760283c59d4a8a79f04f))
* **deps:** update dependency gh-pages to v6 ([#185](https://github.com/zendeskgarden/scripts/issues/185)) ([98e4d54](https://github.com/zendeskgarden/scripts/commit/98e4d54983da42e543edbbc22f5c17df0aafeaeb))
* **deps:** update dependency netlify-cli to v16 ([#186](https://github.com/zendeskgarden/scripts/issues/186)) ([5f8e4ce](https://github.com/zendeskgarden/scripts/commit/5f8e4ce9a25c0e2200cc6e65b5a1a03d9fd00218))

### [2.0.1](https://github.com/zendeskgarden/scripts/compare/v2.0.0...v2.0.1) (2023-08-14)


### Bug Fixes

* **lerna-changelog:** dynamic ESM import ([#181](https://github.com/zendeskgarden/scripts/issues/181)) ([d3048af](https://github.com/zendeskgarden/scripts/commit/d3048af58b16a06a04309b2fec8941a696b795e3))

## [2.0.0](https://github.com/zendeskgarden/scripts/compare/v1.4.3...v2.0.0) (2023-08-04)


### ⚠ BREAKING CHANGES

* convert to ESM (#180)

### Features

* convert to ESM ([#180](https://github.com/zendeskgarden/scripts/issues/180)) ([16b1f5a](https://github.com/zendeskgarden/scripts/commit/16b1f5adbe92328b4d521bdc5214a56a07942f08))

### [1.4.3](https://github.com/zendeskgarden/scripts/compare/v1.4.2...v1.4.3) (2023-07-20)


### Bug Fixes

* **netlify-deploy:** restore missing netlify-cli dependency ([#179](https://github.com/zendeskgarden/scripts/issues/179)) ([57a1066](https://github.com/zendeskgarden/scripts/commit/57a1066212e12a41e60d5a4f83fe38698c8381de))

### [1.4.2](https://github.com/zendeskgarden/scripts/compare/v1.4.1...v1.4.2) (2023-07-18)


### Bug Fixes

* **deps:** update dependency commander to v11 ([#173](https://github.com/zendeskgarden/scripts/issues/173)) ([2844efd](https://github.com/zendeskgarden/scripts/commit/2844efd14ebfc1f3f2938da76391ef6ba4eb7fe2))
* **deps:** update dependency typescript to v5 ([#168](https://github.com/zendeskgarden/scripts/issues/168)) ([1e16786](https://github.com/zendeskgarden/scripts/commit/1e16786420d641cb24564458e3060826e0a804da))
* **deps:** update octokit monorepo ([#172](https://github.com/zendeskgarden/scripts/issues/172)) ([5b926e8](https://github.com/zendeskgarden/scripts/commit/5b926e8ee91527c885965cba3de1603acf1827bb))

### [1.4.1](https://github.com/zendeskgarden/scripts/compare/v1.4.0...v1.4.1) (2023-03-17)


### Bug Fixes

* **deps:** update all non-major dependencies ([#145](https://github.com/zendeskgarden/scripts/issues/145)) ([c3e70c9](https://github.com/zendeskgarden/scripts/commit/c3e70c975fdae4a32700ccc295e63c141232fbb3))
* **deps:** update all non-major dependencies ([#158](https://github.com/zendeskgarden/scripts/issues/158)) ([dbaf7b6](https://github.com/zendeskgarden/scripts/commit/dbaf7b6818ccf6e65704be77279f31c41165c262))
* **deps:** update dependency @octokit/request-error to v3 ([#137](https://github.com/zendeskgarden/scripts/issues/137)) ([1bb5aaf](https://github.com/zendeskgarden/scripts/commit/1bb5aaf43435b797ad8061e45b3a3bdde94420c8))
* **deps:** update dependency @octokit/rest to v19 ([#138](https://github.com/zendeskgarden/scripts/issues/138)) ([68f37e0](https://github.com/zendeskgarden/scripts/commit/68f37e09ab498a2b84fa3c6335e225283dc7a0a2))
* **deps:** update dependency commander to v10 ([#160](https://github.com/zendeskgarden/scripts/issues/160)) ([8d3e378](https://github.com/zendeskgarden/scripts/commit/8d3e3785777f75a27982636561e0a163cb7386f4))
* **deps:** update dependency commander to v9 ([#124](https://github.com/zendeskgarden/scripts/issues/124)) ([91931a7](https://github.com/zendeskgarden/scripts/commit/91931a778c7ca6e2d51108b630b0a73385eedada))
* **deps:** update dependency dotenv to v16 ([#125](https://github.com/zendeskgarden/scripts/issues/125)) ([69a5df5](https://github.com/zendeskgarden/scripts/commit/69a5df590a1a95619ae1ad70e157562a836ff69c))
* **deps:** update dependency fs-extra to v11 ([#155](https://github.com/zendeskgarden/scripts/issues/155)) ([d8e75fc](https://github.com/zendeskgarden/scripts/commit/d8e75fc85b51b74b783af1fc647c35ec2da29953))
* **deps:** update dependency gh-pages to v4 ([#139](https://github.com/zendeskgarden/scripts/issues/139)) ([06f079d](https://github.com/zendeskgarden/scripts/commit/06f079dc210cdbec3c1c33a41705a9a3646ff36a))
* **deps:** update dependency gh-pages to v5 ([#162](https://github.com/zendeskgarden/scripts/issues/162)) ([002d543](https://github.com/zendeskgarden/scripts/commit/002d54326ec03fc79821a6f15a7be6bfb28272cd))
* **deps:** update dependency netlify to v9 ([#112](https://github.com/zendeskgarden/scripts/issues/112)) ([a1df85e](https://github.com/zendeskgarden/scripts/commit/a1df85e005c877c79fcd9d6c2085349c847e42da))
* **deps:** update dependency netlify-cli to v8 ([#113](https://github.com/zendeskgarden/scripts/issues/113)) ([1eef3fc](https://github.com/zendeskgarden/scripts/commit/1eef3fcf9830d4957dd8370266374ef8c64162a8))
* **deps:** update dependency netlify-cli to v9 ([#128](https://github.com/zendeskgarden/scripts/issues/128)) ([d12091b](https://github.com/zendeskgarden/scripts/commit/d12091bdf7f62e5afc47b90a4dd5aca15c9bab86))
* **deps:** update dependency node-fetch to v2.6.7 [security] ([#120](https://github.com/zendeskgarden/scripts/issues/120)) ([97c6604](https://github.com/zendeskgarden/scripts/commit/97c6604ee6f36a3ef9e5d84f8fb93388fe54d137))

## [1.4.0](https://github.com/zendeskgarden/scripts/compare/v1.3.0...v1.4.0) (2021-11-22)


### Features

* **lerna-new:** add `pluralize` and `singularize` handlebars helpers ([#106](https://github.com/zendeskgarden/scripts/issues/106)) ([d989c97](https://github.com/zendeskgarden/scripts/commit/d989c9788e6d904ca4d8ec47d24957b3d4d3e558))

## [1.3.0](https://github.com/zendeskgarden/scripts/compare/v1.2.1...v1.3.0) (2021-11-02)


### Features

* add `cmd-docgen` command ([#96](https://github.com/zendeskgarden/scripts/issues/96)) ([3d7ba99](https://github.com/zendeskgarden/scripts/commit/3d7ba993258354bb8333207655b8445622819883))


### Bug Fixes

* **deps:** update all non-major dependencies ([#89](https://github.com/zendeskgarden/scripts/issues/89)) ([a22f231](https://github.com/zendeskgarden/scripts/commit/a22f2310d77714b9ee8cdac6797422e1113ba0b6))
* **deps:** update dependency klaw to v4 ([#92](https://github.com/zendeskgarden/scripts/issues/92)) ([5bad041](https://github.com/zendeskgarden/scripts/commit/5bad041388ee33335caa34da53662a757b94acb7))

### [1.2.1](https://github.com/zendeskgarden/scripts/compare/v1.2.0...v1.2.1) (2021-09-08)


### Bug Fixes

* **netlify-bandwidth:** add missing args default ([#88](https://github.com/zendeskgarden/scripts/issues/88)) ([cf8250a](https://github.com/zendeskgarden/scripts/commit/cf8250ae19dedbac3a680f0f4a57fa80c21dd35a))

## [1.2.0](https://github.com/zendeskgarden/scripts/compare/v1.1.0...v1.2.0) (2021-09-07)


### Features

* add `cmd-du` command ([#87](https://github.com/zendeskgarden/scripts/issues/87)) ([864cd64](https://github.com/zendeskgarden/scripts/commit/864cd641ec2733340eb575213076ffc36a66b50a))

## [1.1.0](https://github.com/zendeskgarden/scripts/compare/v1.0.1...v1.1.0) (2021-09-01)


### Features

* add `netlify-bandwidth` command ([#86](https://github.com/zendeskgarden/scripts/issues/86)) ([a84b02a](https://github.com/zendeskgarden/scripts/commit/a84b02a0d5fd0e588bb2d7e5e7b6c5804639180b))

### [1.0.1](https://github.com/zendeskgarden/scripts/compare/v1.0.0...v1.0.1) (2021-08-17)


### Bug Fixes

* **deps:** update all non-major dependencies ([#80](https://github.com/zendeskgarden/scripts/issues/80)) ([0798f8a](https://github.com/zendeskgarden/scripts/commit/0798f8a5e4943239319bf14c95205221e7ba86a8))
* **deps:** update dependency commander to v8 ([#82](https://github.com/zendeskgarden/scripts/issues/82)) ([1bbf44c](https://github.com/zendeskgarden/scripts/commit/1bbf44ce97ca6b623bd23c510f039c552dd1a5c9))
* **deps:** update dependency lerna-changelog to v2 ([#83](https://github.com/zendeskgarden/scripts/issues/83)) ([34fe093](https://github.com/zendeskgarden/scripts/commit/34fe0933d023f367066ebc1968eb1c1072334bb8))
* **deps:** update dependency netlify-cli to v6 ([#84](https://github.com/zendeskgarden/scripts/issues/84)) ([aa80ca1](https://github.com/zendeskgarden/scripts/commit/aa80ca1e1ba81e9f5bf50e82c122807e0901204d))

## [1.0.0](https://github.com/zendeskgarden/scripts/compare/v0.1.12...v1.0.0) (2021-08-12)


### Features

* add `lerna-new` command ([#79](https://github.com/zendeskgarden/scripts/issues/79)) ([886399e](https://github.com/zendeskgarden/scripts/commit/886399ecfc7f29b3e89d074db31b283c45203b06))

### [0.1.12](https://github.com/zendeskgarden/scripts/compare/v0.1.11...v0.1.12) (2021-07-30)


### Bug Fixes

* **deps:** roll back is-interactive to v1 ([#76](https://github.com/zendeskgarden/scripts/issues/76)) ([c1e332a](https://github.com/zendeskgarden/scripts/commit/c1e332a7e5af8fcdeb4be2a1e1755aacec1decc0))
* **deps:** update all non-major dependencies ([#41](https://github.com/zendeskgarden/scripts/issues/41)) ([f492ccd](https://github.com/zendeskgarden/scripts/commit/f492ccd26c5d94bd53b2b8658aecce987ee60b0e))
* **deps:** update all non-major dependencies ([#46](https://github.com/zendeskgarden/scripts/issues/46)) ([0875685](https://github.com/zendeskgarden/scripts/commit/0875685e5e5f8643ecaf24ff80c0061cf6760d04))
* **deps:** update all non-major dependencies ([#55](https://github.com/zendeskgarden/scripts/issues/55)) ([6453dbf](https://github.com/zendeskgarden/scripts/commit/6453dbfd56b4284cdeeca70c1eb0a9e2f1470eff))
* **deps:** update all non-major dependencies ([#60](https://github.com/zendeskgarden/scripts/issues/60)) ([6ab0c93](https://github.com/zendeskgarden/scripts/commit/6ab0c93e9f5b715f7c46a98c1c1d2bf4a03ed19f))
* **deps:** update all non-major dependencies ([#64](https://github.com/zendeskgarden/scripts/issues/64)) ([b3f3bd2](https://github.com/zendeskgarden/scripts/commit/b3f3bd23026909ba7e0e3e75154a8dc992597fe4))
* **deps:** update all non-major dependencies ([#69](https://github.com/zendeskgarden/scripts/issues/69)) ([1b84875](https://github.com/zendeskgarden/scripts/commit/1b8487539dd51a108bccc93013a4c903d672d390))
* **deps:** update dependency commander to v7 ([#59](https://github.com/zendeskgarden/scripts/issues/59)) ([0129386](https://github.com/zendeskgarden/scripts/commit/0129386fc1e925b99fdede3edd7f484a88246786))
* **deps:** update dependency dotenv to v10 ([#71](https://github.com/zendeskgarden/scripts/issues/71)) ([64916ab](https://github.com/zendeskgarden/scripts/commit/64916abc56cd254e7d64845b0395f6227c9e53b6))
* **deps:** update dependency execa to v5 ([#49](https://github.com/zendeskgarden/scripts/issues/49)) ([ed29f20](https://github.com/zendeskgarden/scripts/commit/ed29f200fb9b7b00421f3597e9131cb1f7a5bdb0))
* **deps:** update dependency is-interactive to v2 ([#72](https://github.com/zendeskgarden/scripts/issues/72)) ([a675592](https://github.com/zendeskgarden/scripts/commit/a6755923f15534a7fd129eb4df6f44c6016cdc30))
* **deps:** update dependency netlify to v6 ([#50](https://github.com/zendeskgarden/scripts/issues/50)) ([f4f60ce](https://github.com/zendeskgarden/scripts/commit/f4f60cead5823dba7599b781f4cf69ac8ce6ac67))
* **deps:** update dependency netlify to v6.1.22 ([#66](https://github.com/zendeskgarden/scripts/issues/66)) ([c6ade21](https://github.com/zendeskgarden/scripts/commit/c6ade21073a6c186593d0df6083324b468704e6a))
* prevent husky from running on postinstall ([#63](https://github.com/zendeskgarden/scripts/issues/63)) ([9b8d633](https://github.com/zendeskgarden/scripts/commit/9b8d633333c53304fc0005f785d92d3712284747))

### [0.1.11](https://github.com/zendeskgarden/scripts/compare/v0.1.10...v0.1.11) (2020-08-22)


### Bug Fixes

* **deps:** update all non-major dependencies ([#22](https://github.com/zendeskgarden/scripts/issues/22)) ([490e18b](https://github.com/zendeskgarden/scripts/commit/490e18bacd45d2b48f8facd14782d66107e54940))
* **deps:** update all non-major dependencies ([#28](https://github.com/zendeskgarden/scripts/issues/28)) ([2b83eb3](https://github.com/zendeskgarden/scripts/commit/2b83eb30f56570b8aa7e41d515c3f6694b6a44c8))
* **deps:** update all non-major dependencies ([#33](https://github.com/zendeskgarden/scripts/issues/33)) ([b92f355](https://github.com/zendeskgarden/scripts/commit/b92f3558688072dceba8531b18ff3b26f4522f9a))
* **deps:** update dependency @octokit/rest to v18 ([#29](https://github.com/zendeskgarden/scripts/issues/29)) ([bd2ed3b](https://github.com/zendeskgarden/scripts/commit/bd2ed3b44eedb3a3c94abaad71a2465c1d6fd2d3))
* **deps:** update dependency commander to v6 ([#36](https://github.com/zendeskgarden/scripts/issues/36)) ([28c60a3](https://github.com/zendeskgarden/scripts/commit/28c60a36e32f12996c81f631f749b6957a8081d0))
* **deps:** update dependency gh-pages to v3 ([#26](https://github.com/zendeskgarden/scripts/issues/26)) ([6d6bcf1](https://github.com/zendeskgarden/scripts/commit/6d6bcf1408a09aebe4e554d96adb232d904b6b6d))
* **deps:** update dependency ora to v5 ([#37](https://github.com/zendeskgarden/scripts/issues/37)) ([b6397ba](https://github.com/zendeskgarden/scripts/commit/b6397babbeacc897572a77b879dfc4688f23b9f3))
* **github-deploy:** prevent deployment success when <command> fails ([#40](https://github.com/zendeskgarden/scripts/issues/40)) ([9cd812e](https://github.com/zendeskgarden/scripts/commit/9cd812e2f0599233c3a29736bd0a0a9902ab4ece))

### [0.1.10](https://github.com/zendeskgarden/scripts/compare/v0.1.9...v0.1.10) (2020-05-21)


### Bug Fixes

* **deps:** update all non-major dependencies ([#19](https://github.com/zendeskgarden/scripts/issues/19)) ([68f06d1](https://github.com/zendeskgarden/scripts/commit/68f06d1e55f1be31716e2bd1252d70da46a0363f))

### [0.1.9](https://github.com/zendeskgarden/scripts/compare/v0.1.8...v0.1.9) (2020-05-08)


### Bug Fixes

* correctly parse `github-repository` owner and repo ([#18](https://github.com/zendeskgarden/scripts/issues/18)) ([a56f91c](https://github.com/zendeskgarden/scripts/commit/a56f91ced8b988f9c01adf16ac93144adad48745))
* **deps:** update all non-major dependencies ([#15](https://github.com/zendeskgarden/scripts/issues/15)) ([f19a356](https://github.com/zendeskgarden/scripts/commit/f19a3563b732b4a9f250de0c2051b4c669bbd2f1))
* **deps:** update dependency @octokit/rest to v17.8.0 ([#16](https://github.com/zendeskgarden/scripts/issues/16)) ([50b320a](https://github.com/zendeskgarden/scripts/commit/50b320a23494aa3fcdea2889df576afca0643978))

### [0.1.8](https://github.com/zendeskgarden/scripts/compare/v0.1.7...v0.1.8) (2020-05-06)


### Bug Fixes

* improve error handling ([#13](https://github.com/zendeskgarden/scripts/issues/13)) ([32fd059](https://github.com/zendeskgarden/scripts/commit/32fd0599472bf69eadf8e4c6a26757e9795c7a03))
* **deps:** update all non-major dependencies ([#14](https://github.com/zendeskgarden/scripts/issues/14)) ([e033fdd](https://github.com/zendeskgarden/scripts/commit/e033fdd62ac3264ec261b2ed9ec55c0ab9404a05))

### [0.1.7](https://github.com/zendeskgarden/scripts/compare/v0.1.6...v0.1.7) (2020-04-26)


### Bug Fixes

* commit retrieval for travis PR jobs ([#12](https://github.com/zendeskgarden/scripts/issues/12)) ([4ad2bd2](https://github.com/zendeskgarden/scripts/commit/4ad2bd260ebd19af3f75115bacac697ee96c998c))

### [0.1.6](https://github.com/zendeskgarden/scripts/compare/v0.1.5...v0.1.6) (2020-04-26)


### Bug Fixes

* branch retrieval for travis PR jobs ([#11](https://github.com/zendeskgarden/scripts/issues/11)) ([58548bc](https://github.com/zendeskgarden/scripts/commit/58548bcc5a0c42cdeeefe24ecf38d8be576e44f0))

### [0.1.5](https://github.com/zendeskgarden/scripts/compare/v0.1.4...v0.1.5) (2020-04-23)


### Bug Fixes

* **deps:** update all non-major dependencies ([#6](https://github.com/zendeskgarden/scripts/issues/6)) ([394efe6](https://github.com/zendeskgarden/scripts/commit/394efe613ed579e2dbd9eac9c4a3de5c546612c7))
* **deps:** update dependency @octokit/rest to v17.5.2 ([#9](https://github.com/zendeskgarden/scripts/issues/9)) ([4d258bc](https://github.com/zendeskgarden/scripts/commit/4d258bc7d943ee37a95e45437c333a9c60d57a77))
* override default auto merge for `github-deploy` ([#10](https://github.com/zendeskgarden/scripts/issues/10)) ([6997480](https://github.com/zendeskgarden/scripts/commit/69974803f264b9b0cd7c8b2801ebc331b6acf958))

### [0.1.4](https://github.com/zendeskgarden/scripts/compare/v0.1.3...v0.1.4) (2020-04-16)


### Bug Fixes

* prevent unintended user publish to gh-pages ([#5](https://github.com/zendeskgarden/scripts/issues/5)) ([c046c25](https://github.com/zendeskgarden/scripts/commit/c046c2557db85ff538148b7a42718056204e9b21))

### [0.1.3](https://github.com/zendeskgarden/scripts/compare/v0.1.2...v0.1.3) (2020-04-15)

### [0.1.2](https://github.com/zendeskgarden/scripts/compare/v0.1.1...v0.1.2) (2020-04-15)


### Bug Fixes

* update with corrected repo name ([#3](https://github.com/zendeskgarden/scripts/issues/3)) ([6feccce](https://github.com/zendeskgarden/scripts/commit/6feccce9b6362e74ba7f2ae7aa2c14f6c190fd43))

### [0.1.1](https://github.com/zendeskgarden/scripts/compare/v0.1.0...v0.1.1) (2020-04-15)


### Bug Fixes

* exclude CHANGELOG.md from formatting/linting ([#2](https://github.com/zendeskgarden/scripts/issues/2)) ([e8c54c8](https://github.com/zendeskgarden/scripts/commit/e8c54c88e8976b213efa01ede3cacfdc529111e0))

## 0.1.0 (2020-04-14)


### Features

* initial garden CLI ([#1](https://github.com/zendeskgarden/scripts/issues/1)) ([fd3528d](https://github.com/zendeskgarden/scripts/commit/fd3528d8869929cf71dcfffece9706453ce05fb5))
