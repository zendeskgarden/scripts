/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import { Ora } from 'ora';
import Project from '@lerna/project';
import execa from 'execa';

interface ILernaConfigArgs {
  path?: string;
  spinner?: Ora;
}

export const execute = async (args: ILernaConfigArgs = {}): Promise<any | undefined> => {
  let retVal: any | undefined;

  try {
    const revParseArgs = ['rev-parse', '--show-toplevel'];

    if (args.path) {
      revParseArgs.unshift('-C', args.path);
    }

    const rootPath = await execa('git', revParseArgs);
    const project = new Project(rootPath.stdout);

    retVal = project.config;
  } catch (error) {
    handleErrorMessage(error.message ? error.message : error, 'lerna-config', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('lerna-config');

  return command
    .description('output Lerna config for the repo')
    .arguments('[path]')
    .action(async path => {
      try {
        spinner.start();

        const config = await execute({
          path,
          spinner
        });

        if (config && config.version) {
          const message = JSON.stringify(config, null /* replacer */, 2 /* space */);

          spinner.clear();
          handleSuccessMessage(message);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Unable to find Lerna config');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
