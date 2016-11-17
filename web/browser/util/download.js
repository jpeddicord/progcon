/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

export function triggerTextDownload(filename, text) {
  const encoded = encodeURIComponent(text);
  const uri = `data:text/plain;charset=utf-8,${encoded}`;

  // make a fake link and "click" it
  const ele = document.createElement('a');
  ele.setAttribute('download', filename);
  ele.setAttribute('href', uri);
  ele.style.display = 'none';
  document.body.appendChild(ele);
  ele.click();
  document.body.removeChild(ele);
}
