/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { bgRed, red } from 'chalk';
import { Ora } from 'ora';
import isInteractive from 'is-interactive';

/**
 * Handle error message output.
 *
 * @param error The error to output.
 * @param {string} command The current command.
 * @param {Ora} [spinner] Terminal spinner.
 */
export const handleErrorMessage = (error: unknown, command?: string, spinner?: Ora): void => {
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

/**
 * Handle success message output.
 *
 * @param message The message to output.
 * @param {Ora} [spinner] Terminal spinner.
 */
export const handleSuccessMessage = (message: string, spinner?: Ora): void => {
  if (spinner && isInteractive()) {
    spinner.succeed(message);
  } else {
    console.log(message);
  }
};
