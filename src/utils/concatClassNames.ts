/**
 * The code in this file was copied from https://github.com/lukeed/clsx.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v2.1.1/src/lite.js
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */

export function ccn(...classNames: unknown[]) {
  let i = 0,
    tmp: unknown,
    str = "";
  const len = classNames.length;

  for (; i < len; i++) {
    if ((tmp = classNames[i])) {
      if (typeof tmp === "string") {
        str += (str && " ") + tmp;
      }
    }
  }
  return str;
}
