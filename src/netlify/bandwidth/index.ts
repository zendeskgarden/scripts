/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import commander, { Command } from 'commander';
import fetch, { RequestInit } from 'node-fetch';
import { siteId as getSiteId, token as getToken } from '..';
import { handleErrorMessage, handleSuccessMessage } from '../../utils';
import NetlifyAPI from 'netlify';
import { Ora } from 'ora';

interface INetlifyBandwidthArgs {
  token?: string;
  siteId?: string;
  spinner?: Ora;
}

export const execute = async (args: INetlifyBandwidthArgs): Promise<void> => {
  const token = args.token || (await getToken(args.spinner));
  const client = new NetlifyAPI(token);
  const siteId = args.siteId || (await getSiteId(args.spinner));

  /* https://open-api.netlify.com/#operation/getSite */
  const siteResponse = await client.getSite({ siteId });
  const url = `${client.basePath}/accounts/${siteResponse.account_slug}/bandwidth`;
  /* bandwidth API call not yet supported by Netlify */
  const response = await fetch(url, { headers: client.defaultHeaders });

  if (response.ok) {
    const data = await response.json();
    const retVal = (data.included as number) + (data.additional as number) - data.used;

    console.log(retVal);
  }
};

export default (spinner: Ora): commander.Command => {
  const command = new Command('netlify-bandwidth');

  return command
    .description('get Netlify bandwidth')
    .option('-t, --token <token>', 'access token')
    .action(async () => {
      try {
        spinner.start();

        await execute({ spinner });

        // if (bandwidth) {
        //   handleSuccessMessage(bandwidth, spinner);
        // } else {
        //   throw new Error();
        // }
      } catch {
        spinner.fail('Netlify bandwidth not found');
        process.exitCode = 1;
      } finally {
        spinner.stop();
      }
    });
};
