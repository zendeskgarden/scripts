/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { execute as changelog, default as changelogCommand } from './changelog/index.js';
import { execute, default as newCommand } from './new/index.js';

const commands = { changelogCommand, newCommand };

export { commands as default, changelog, changelogCommand, execute as new, newCommand };
