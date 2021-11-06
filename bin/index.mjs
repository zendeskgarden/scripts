#!/usr/bin/env node

/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import cmd from '../dist/cmd/index.js';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import figlet from 'figlet';
import github from '../dist/github/index.js';
import lerna from '../dist/lerna/index.js';
import netlify from '../dist/netlify/index.js';
import ora from 'ora';

const program = new Command();
const spinner = ora();
const version = createRequire(import.meta.url)('../package.json').version;

dotenv.config();

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
    console.log(chalk.hex('#5EAE91')(figlet.textSync('garden')));
    console.log();
    program.help();
  })
  .parse();
