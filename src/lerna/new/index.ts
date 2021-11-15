/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { kebabCase, snakeCase, startCase } from 'lodash';
import { readFile, rename, writeFile } from 'fs/promises';
import { Ora } from 'ora';
import { copy } from 'fs-extra';
import { default as handlebars } from 'handlebars';
import { default as helpers } from 'handlebars-helpers';
import { resolve } from 'path';
import { default as walk } from 'klaw';

/**
 * Register handlebars helpers.
 */
const registerHelpers = (): void => {
  helpers({ handlebars });

  handlebars.registerHelper('kebabcase', (string: string) => kebabCase(string));
  handlebars.registerHelper('snakecase', (string: string) => snakeCase(string));
  handlebars.registerHelper('startcase', (string: string) => startCase(string));
};

interface ILernaNewArgs {
  src: string;
  dest: string;
  tags?: Record<string, string>;
  spinner?: Ora;
}

type RETVAL = {
  src: string;
  dest: string;
};

/**
 * Execute the `lerna-new` command.
 *
 * @param {string} args.src Source directory.
 * @param {string} args.dest Destination directory.
 * @param {object} args.tags Handlebars template name-value pairs.
 * @param {string} [args.spinner] Terminal spinner.
 *
 * @returns {object} The resolved source and destination paths.
 */
export const execute = async (args: ILernaNewArgs): Promise<RETVAL | undefined> => {
  const retVal = {
    src: resolve(args.src),
    dest: resolve(args.dest)
  };

  try {
    await copy(retVal.src, retVal.dest, { overwrite: false, errorOnExist: true });
    registerHelpers();

    for await (const file of walk(retVal.dest)) {
      const path = handlebars.compile(file.path)(args.tags);

      if (file.path !== path) {
        await rename(file.path, path);
      }

      if (!file.stats.isDirectory()) {
        const content = await readFile(path, 'utf8');
        const data = handlebars.compile(content)(args.tags);

        await writeFile(path, data, 'utf8');
      }
    }
  } catch (error: unknown) {
    handleErrorMessage(error, 'lerna-new', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('lerna-new');

  return command
    .description('generate a new package from a template source directory')
    .argument('<src>', 'template source directory')
    .argument('<dest>', 'package destination directory')
    .option(
      '-t --tag <tags...>',
      '{{Handlebars}} template <name>=<value> tags',
      (tag: string, retVal: Record<string, string> = {}) => {
        const [name, value] = tag.split('=');

        retVal[name] = value;

        return retVal;
      }
    )
    .action(async (src, dest) => {
      try {
        spinner.start();

        const tags = command.opts().tag;
        const result = await execute({ src, dest, tags, spinner });

        if (result) {
          handleSuccessMessage(`${result.src} -> ${result.dest}`, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Unable to generate new package');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
