/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import { siteId as getSiteId, token as getToken } from '..';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import NetlifyAPI from 'netlify';
import { Ora } from 'ora';
import fetch from 'node-fetch';

interface INetlifyBandwidthArgs {
  token?: string;
  siteId?: string;
  spinner?: Ora;
}

type RETVAL = {
  available: number;
  used: number;
};

/**
 * Execute the `netlify-bandwidth` command.
 *
 * @param {string} [args.token] Netlify personal access token.
 * @param {string} [args.siteId] Netlify site API ID.
 * @param {Ora} [args.spinner] Terminal spinner.
 *
 * @returns {object} The Netlify available and used bandwidth byte counts.
 */
export const execute = async (args: INetlifyBandwidthArgs = {}): Promise<RETVAL | undefined> => {
  let retVal: RETVAL | undefined;

  try {
    const token = args.token || (await getToken(args.spinner));
    const client = new NetlifyAPI(token);
    const siteId = args.siteId || (await getSiteId(args.spinner));

    /* https://open-api.netlify.com/#operation/getSite */
    let response = await client.getSite({ siteId });
    const url = `${client.basePath}/accounts/${response.account_slug}/bandwidth`;

    /* bandwidth API call not yet supported by Netlify */
    response = await fetch(url, { headers: client.defaultHeaders });

    if (response.ok) {
      const data = await response.json();

      retVal = {
        available: (data.included as number) + (data.additional as number),
        used: data.used
      };
    } else {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
  } catch (error: unknown) {
    handleErrorMessage(error, 'netlify-bandwidth', args.spinner);

    throw error;
  }

  return retVal;
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('netlify-bandwidth');

  return command
    .description('output remaining Netlify bandwidth')
    .option('-i, --id <id>', 'site API ID')
    .option('-t, --token <token>', 'access token')
    .action(async () => {
      try {
        spinner.start();

        const options = command.opts();
        const result = await execute({
          token: options.token,
          siteId: options.id,
          spinner
        });

        if (result) {
          const bandwidth = `${result.available - result.used}`;

          handleSuccessMessage(bandwidth, spinner);
        } else {
          throw new Error();
        }
      } catch {
        spinner.fail('Bandwidth not found');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
