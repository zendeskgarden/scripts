/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import { Command } from 'commander';
import { Ora } from 'ora';
import execa from 'execa';

/**
 * Execute the `netlify-site-id` command.
 *
 * @param {Ora} [spinner] Terminal spinner.
 *
 * @returns {Promise<string>} The value provided by the `NETLIFY_SITE_ID`
 * environment variable or the value of the `netlify.siteid` git configuration
 * option.
 */
export const execute = async (spinner?: Ora): Promise<string | undefined> => {
  let retVal = process.env.NETLIFY_SITE_ID;

  if (!retVal) {
    try {
      const siteId = await execa('git', ['config', '--get', 'netlify.siteid']);

      retVal = siteId.stdout.toString();
    } catch (error) {
      handleErrorMessage(error, 'netlify-site-id', spinner);

      throw error;
    }
  }

  return retVal;
};

export default (spinner: Ora) => {
  const command = new Command('netlify-site-id');

  return command.description('output Netlify site API ID').action(async () => {
    try {
      spinner.start();

      const siteId = await execute(spinner);

      if (siteId) {
        handleSuccessMessage(siteId, spinner);
      } else {
        throw spinner.fail('Netlify site ID not found');
      }
    } catch (error) {
      process.exit(1);
    } finally {
      spinner.stop();
    }
  });
};
