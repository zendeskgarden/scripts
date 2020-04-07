/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Command } from 'commander';
import execa from 'execa';
import { red } from 'chalk';

/**
 * Execute the `netlify-site-id` command.
 *
 * @returns {string} The value provided by the `NETLIFY_SITE_ID` environment
 * variable or the value of the `netlify.siteid` git configuration option.
 */
export const execute = async (): Promise<string | undefined> => {
  let retVal = process.env.NETLIFY_SITE_ID;

  if (!retVal) {
    try {
      const siteId = await execa('git', ['config', '--get', 'netlify.siteid']);

      retVal = siteId.stdout.toString();
    } catch (error) {
      console.error(red(error));
    }
  }

  return retVal;
};

export default () => {
  const command = new Command('netlify-site-id');

  return command.description('show Netlify site API ID').action(async () => {
    const siteId = await execute();

    if (siteId) {
      console.log(siteId);
    } else {
      console.error(red('Netlify site ID not found'));
      process.exit(1);
    }
  });
};
