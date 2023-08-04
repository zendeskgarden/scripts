/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Ora } from 'ora';
import chalk from 'chalk';
import isInteractive from 'is-interactive';

/**
 * Handle error message output.
 *
 * @param error The error to output.
 * @param {string} command The current command.
 * @param {Ora} [spinner] Terminal spinner.
 */
export const handleErrorMessage = (error: unknown, command?: string, spinner?: Ora): void => {
  let message = chalk.red(error);

  if (command) {
    const prefix = isInteractive() ? chalk.bgRed(command) : `[${command}]`;

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

/**
 * Handle warning message output.
 *
 * @param message The message to output.
 * @param {Ora} [spinner] Terminal spinner.
 */
export const handleWarningMessage = (message: string, spinner?: Ora): void => {
  if (spinner && isInteractive()) {
    spinner.warn(message);
  } else {
    console.log(message);
  }
};
