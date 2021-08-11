/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { readFile, writeFile } from 'fs/promises';
import { Ora } from 'ora';
import { copy } from 'fs-extra';
import { default as handlebars } from 'handlebars';
import { default as helpers } from 'handlebars-helpers';
import { resolve } from 'path';
import { default as walk } from 'klaw';

interface ILernaNewArgs {
  src: string;
  dest: string;
  tags?: Record<string, string>;
  spinner?: Ora;
}

/**
 * Execute the `lerna-new` command.
 *
 * @param {string} args.src Source directory.
 * @param {string} args.dest Destination directory.
 * @param {Object} args.tags Handlebars template name-value pairs.
 * @param {string} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The normalized, resolved destination path.
 */
export const execute = async (args: ILernaNewArgs): Promise<string | undefined> => {
  const retVal = resolve(args.dest);
  const src = resolve(args.src);

  try {
    await copy(src, retVal, { overwrite: false, errorOnExist: true });
    helpers({ handlebars }); // register handlebars template helper utilities

    for await (const file of walk(retVal)) {
      if (!file.stats.isDirectory()) {
        const path = file.path as string;
        const content = await readFile(path, 'utf8');
        const template = handlebars.compile(content);
        const data = template(args.tags);

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
    .description('generate a new Lerna package from a template source directory')
    .arguments('<src> <dest>')
    .option(
      '-t --tag <tags...>',
      '{{Handlebars}} template <name>=<value> tags',
      (tag: string, retVal: Record<string, string>) => {
        const [name, value] = tag.split('=');

        retVal[name] = value;

        return retVal;
      },
      {}
    )
    .action(async (src, dest) => {
      try {
        spinner.start();

        const tags = command.opts().tag;
        const directory = await execute({ src, dest, tags, spinner });

        if (directory) {
          handleSuccessMessage(directory, spinner);
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
