/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

// this shim will only import the languages we need.
// don't import just highlight.js, as that will cause webpack to bundle every language.

const hljs = require('highlight.js/lib/highlight');
require('../../styles/hljs-solarized-light.css');

hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'));
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));

export default hljs;
