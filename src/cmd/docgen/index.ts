/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { GlobTask, globby } from 'globby';
import { ParserOptions, withCustomConfig, withDefaultConfig } from 'react-docgen-typescript';
import {
  handleErrorMessage,
  handleSuccessMessage,
  handleWarningMessage
} from '../../utils/index.js';
import { Command } from 'commander';
import { Ora } from 'ora';
import { parse as parseComment } from 'comment-parser';
import { resolve } from 'path';
import ts from 'typescript';

type TAGS = Record<string, string>;

type PROPS = Record<
  string,
  {
    description: string;
    defaultValue: string;
    required: boolean;
    type: string;
    params: TAGS;
    returns?: string;
  }
>;

type RETVAL = {
  name: string;
  description: string;
  extends: string;
  props: PROPS;
  file: string;
}[];

interface ICommandDocgenArgs {
  paths: string[] | string;
  extensions?: string[];
  ignore?: string[];
  spinner?: Ora;
}

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];
const DEFAULT_IGNORE = ['**/*.spec.*', '**/dist/**', '**/node_modules/**'];

/**
 * Execute the `cmd-docgen` command.
 *
 * @param {string[] | string} args.paths Component path globs.
 * @param {string[]} [args.extensions] File extensions to consider.
 * @param {string[]} [args.ignore] Paths to ignore.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {object} Generated component documentation information.
 */
export const execute = async (
  args: ICommandDocgenArgs = {
    paths: [],
    extensions: DEFAULT_EXTENSIONS,
    ignore: DEFAULT_IGNORE
  }
): Promise<RETVAL | undefined> => {
  let retVal: RETVAL | undefined;

  try {
    const parserOptions: ParserOptions = {
      propFilter: props =>
        !(
          props.description.includes('@ignore') ||
          (props.parent && props.parent.fileName.includes('node_modules'))
        ),
      shouldRemoveUndefinedFromOptional: true
    };
    const globbyOptions: GlobTask['options'] = {
      expandDirectories: {
        extensions: args.extensions || DEFAULT_EXTENSIONS
      },
      ignore: args.ignore || DEFAULT_IGNORE
    };

    for await (const path of Array.isArray(args.paths) ? args.paths : [args.paths]) {
      const resolvedPath = resolve(path);
      /* eslint-disable-next-line @typescript-eslint/unbound-method */
      const tsconfigPath = ts.findConfigFile(resolvedPath, ts.sys.fileExists);
      const parser = tsconfigPath
        ? withCustomConfig(tsconfigPath, parserOptions)
        : withDefaultConfig(parserOptions);
      const paths = await globby(resolvedPath, globbyOptions);
      const components = parser.parse(paths);

      retVal = components.map(component => {
        const props: PROPS = {};

        Object.keys(component.props)
          .sort(undefined)
          .forEach(key => {
            const prop = component.props[key];
            const type = prop.type.name.replace(/"/gu, "'");
            let defaultValue =
              prop.defaultValue && prop.defaultValue.value && prop.defaultValue.value.toString();

            if (
              (type === 'string' && defaultValue !== null) ||
              type.includes(`'${defaultValue}'`)
            ) {
              // Surround default string literals with quotes.
              defaultValue = `'${defaultValue}'`;
            }

            const params: TAGS = {};
            let description;
            let returns;

            if (prop.description) {
              description = parseComment(`/** ${prop.description} */`)[0];
              description.tags
                .filter(tag => tag.tag === 'param')
                .forEach(param => {
                  params[param.name] = param.description;
                });
              returns = description.tags.find(tag => tag.tag.startsWith('return'));
            }

            props[key] = {
              description: description ? description.description : '',
              defaultValue,
              required: prop.required,
              type,
              params,
              returns: returns ? returns.description : undefined
            };
          });

        return {
          name: component.displayName,
          description: component.description,
          extends: component.tags ? (component.tags as TAGS).extends : '',
          props,
          file: component.filePath
        };
      });
    }
  } catch (error: unknown) {
    handleErrorMessage(error, 'cmd-docgen', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): Command => {
  const command = new Command('cmd-docgen');

  return command
    .description('generate component documentation')
    .argument('<paths...>', 'one or more component paths')
    .option(
      '-x --extensions <extensions...>',
      'file extensions to consider',
      DEFAULT_EXTENSIONS as unknown as string
    )
    .option('-i --ignore <ignore...>', 'paths to ignore', DEFAULT_IGNORE as unknown as string)
    .option('--pretty', 'pretty-print JSON')
    .action(async (paths: string[]) => {
      try {
        spinner.start();

        const options = command.opts();
        const result = await execute({
          paths,
          extensions: options.extensions,
          ignore: options.ignore,
          spinner
        });

        if (result) {
          if (result.length > 0) {
            const space = options.pretty ? 2 : undefined;
            const message = JSON.stringify(result, undefined, space);

            handleSuccessMessage(message, spinner);
          } else {
            handleWarningMessage('Component not found', spinner);
          }
        } else {
          throw Error();
        }
      } catch {
        spinner.fail('Unable to generate documentation');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
