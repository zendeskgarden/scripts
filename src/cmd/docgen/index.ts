/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { ParserOptions, withCustomConfig } from 'react-docgen-typescript';
import commander, { Command } from 'commander';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Ora } from 'ora';
import { parse as parseComment } from 'comment-parser';
import { parse } from 'react-docgen';
import { resolve } from 'path';

type TAGS = Record<string, string>;

interface IDocgenProp {
  description: string;
  defaultValue: string;
  required: boolean;
  type: string;
  params: TAGS;
  returns?: string;
}

type PROPS = Record<string, IDocgenProp>;

interface IDocgenComponent {
  name: string;
  description: string;
  extends: string;
  props: PROPS;
}

const TSCONFIG_PATH = resolve(__dirname, '../../../..', 'react-components', 'tsconfig.json');

const docgen = (files: string[]) => {
  let retVal;

  try {
    files.forEach(file => console.log(parse(resolve(file))));
  } catch (error) {
    handleErrorMessage(error, 'cmd-docgen');
  }

  return retVal;
};

export const execute = async (files: string[], spinner?: Ora): Promise<IDocgenComponent[]> => {
  let retVal: IDocgenComponent[] = [];

  try {
    //
  } catch (error: unknown) {
    handleErrorMessage(error, 'cmd-docgen', spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('cmd-docgen');

  return command
    .argument('<files...>')
    .description('')
    .action((files: string[]) => {
      try {
        spinner.start();

        console.log(docgen(files));

        const options: ParserOptions = {
          propFilter: props =>
            !(
              props.description.includes('@ignore') ||
              (props.parent && props.parent.fileName.includes('node_modules'))
            ),
          shouldRemoveUndefinedFromOptional: true
        };
        const parser = withCustomConfig(TSCONFIG_PATH, options);
        const components = parser.parse(files);

        const retVal = components.map(component => {
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
                returns = description.tags.find(tag => tag.tag.startsWith('return') as boolean);
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
            props
          };
        });

        console.log(JSON.stringify(retVal, null, '  '));
      } catch {
        spinner.fail('');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
