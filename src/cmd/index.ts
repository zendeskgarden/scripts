/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { execute as codemod, default as codemodCommand } from './codemod/index.js';
import { execute as docgen, default as docgenCommand } from './docgen/index.js';
import { execute as du, default as duCommand } from './du/index.js';

const commands = { codemodCommand, docgenCommand, duCommand };

export { commands as default, codemod, codemodCommand, docgen, docgenCommand, du, duCommand };
