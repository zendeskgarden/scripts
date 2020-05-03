/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Changelog } from 'lerna-changelog';
import { Command } from 'commander';
import { Ora } from 'ora';
import execa from 'execa';
import { fromPath } from 'lerna-changelog/lib/configuration';
import { token as getToken } from '../../github';

interface ILernaChangelogArgs {
  from?: string;
  to?: string;
  path?: string;
  token?: string;
  spinner?: Ora;
}

/**
 * Execute the `lerna-changelog` command.
 *
 * @param {string} [args.from] GitHub ref (commit SHA, tag).
 * @param {string} [args.to] GitHub ref (commit SHA, tag).
 * @param {string} [args.path] Path to a git directory.
 * @param {string} [args.token] GitHub personal access token.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The markdown result of the changelog command.
 */
export const execute = async (args: ILernaChangelogArgs = {}): Promise<string | undefined> => {
  let retVal: string | undefined;

  try {
    process.env.GITHUB_AUTH = args.token || (await getToken(args.spinner));

    const revParseArgs = ['rev-parse', '--show-toplevel'];
    const describeArgs = ['describe', '--abbrev=0', '--tags'];

    if (args.path) {
      revParseArgs.unshift('-C', args.path);
      describeArgs.unshift('-C', args.path);
    }

    const rootPath = await execa('git', revParseArgs);
    const config = fromPath(rootPath.stdout);
    const changelog = new Changelog(config);
    let tagTo = args.to;
    let tagFrom = args.from;

    if (!tagTo) {
      const describe = await execa('git', describeArgs);

      tagTo = describe.stdout.toString();
    }

    if (!tagFrom) {
      describeArgs.push(`${tagTo}^`);

      const describe = await execa('git', describeArgs);

      tagFrom = describe.stdout.toString();
    }

    process.chdir(rootPath.stdout);

    retVal = await changelog.createMarkdown({
      tagFrom,
      tagTo
    });
  } catch (error) {
    handleErrorMessage(error.message ? error.message : error, 'lerna-changelog', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('lerna-changelog');

  return command
    .description('output generated changelog markdown for the repo')
    .arguments('[path]')
    .option('-f, --from <from-tag>', 'GitHub tag or commit SHA')
    .option('-t, --to <to-tag>', 'GitHub tag or commit SHA')
    .option('-a, --token <token>', 'GitHub access token')
    .action(async path => {
      try {
        spinner.start();

        const markdown = await execute({
          path,
          from: command.from,
          to: command.to,
          token: command.token,
          spinner
        });

        if (markdown) {
          handleSuccessMessage(markdown, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Unable to generate changelog');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
