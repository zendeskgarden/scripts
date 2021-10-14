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
const spinner = require('ora')();
const version = require('../package.json').version;
const cmd = require('../dist/cmd');
const github = require('../dist/github');
const lerna = require('../dist/lerna');
const netlify = require('../dist/netlify');

require('dotenv').config();

program
  .version(version)
  .addCommand(cmd.docgenCommand(spinner))
  .addCommand(cmd.duCommand(spinner))
  .addCommand(github.branchCommand(spinner))
  .addCommand(github.commitCommand(spinner))
  .addCommand(github.deployCommand(spinner))
  .addCommand(github.pagesCommand(spinner))
  .addCommand(github.releaseCommand(spinner))
  .addCommand(github.repositoryCommand(spinner))
  .addCommand(github.tokenCommand(spinner))
  .addCommand(lerna.changelogCommand(spinner))
  .addCommand(lerna.newCommand(spinner))
  .addCommand(netlify.bandwidthCommand(spinner))
  .addCommand(netlify.deployCommand(spinner))
  .addCommand(netlify.siteIdCommand(spinner))
  .addCommand(netlify.tokenCommand(spinner))
  .action(() => {
    console.log(chalk.hex('#5EAE91')(textSync('garden')));
    console.log();
    program.help();
  })
  .parse();
