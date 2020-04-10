#!/usr/bin/env node

/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

const Command = require('commander').Command;
const program = new Command();
const chalk = require('chalk');
const textSync = require('figlet').textSync;
const ora = require('ora');
const version = require('../package.json').version;
const github = require('../dist/github');
const netlify = require('../dist/netlify');

const spinner = ora();

program
  .version(version)
  .addCommand(github.branchCommand(spinner))
  .addCommand(github.commitCommand(spinner))
  .addCommand(github.deployCommand(spinner))
  .addCommand(github.ownerCommand(spinner))
  .addCommand(github.pagesCommand(spinner))
  .addCommand(github.repoCommand(spinner))
  .addCommand(github.tokenCommand(spinner))
  .addCommand(netlify.deployCommand(spinner))
  .addCommand(netlify.siteIdCommand(spinner))
  .addCommand(netlify.tokenCommand(spinner))
  .action(() => {
    console.log(chalk.hex('#5EAE91')(textSync('garden')));
    console.log();
    program.help();
  })
  .parse();
