/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { bgRed, red } from 'chalk';
import { Ora } from 'ora';
import isInteractive from 'is-interactive';

export const handleErrorMessage = (error: any, command?: string, spinner?: Ora) => {
  let message = red(error);

  if (command) {
    const prefix = isInteractive() ? bgRed(command) : `[${command}]`;

    message = `${prefix} ${message}`;
  }

  if (spinner) {
    spinner.fail(message);
  } else {
    console.error(message);
  }
};

export const handleSuccessMessage = (message: string, spinner?: Ora) => {
  if (spinner && isInteractive()) {
    spinner.succeed(message);
  } else {
    console.log(message);
  }
};
