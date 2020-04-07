#!/usr/bin/env node

/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

const chalk = require('chalk');
const PALETTE = require('@zendeskgarden/react-theming').PALETTE;
const textSync = require('figlet').textSync;

console.log(chalk.hex(PALETTE.green[400])(textSync('garden')));
console.log();

const Command = require('commander').Command;
const program = new Command();
const version = require('../package.json').version;
const github = require('../dist/github');
const netlify = require('../dist/netlify');

program
  .version(version)
  .addCommand(github.branchCommand())
  .addCommand(github.commitCommand())
  .addCommand(github.deploymentCommand())
  .addCommand(github.deploymentStatusCommand())
  .addCommand(github.ownerCommand())
  .addCommand(github.pagesCommand())
  .addCommand(github.repoCommand())
  .addCommand(github.tokenCommand())
  .addCommand(netlify.deployCommand())
  .addCommand(netlify.siteIdCommand())
  .addCommand(netlify.tokenCommand())
  .parse();
