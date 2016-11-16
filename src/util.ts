import * as colorString from 'color-string';
const colorDiff = require('color-diff');
import { chain } from 'lodash';

export function parseColor(s: string): RgbColor | null {
  if (/^\d+$/.test(s)) {
    return null;
  }  
  const p = colorString.get.rgb(s);
  return p && {
    R: p[0],
    G: p[1],
    B: p[2],
    A: p[3],
  }
}

export function isColor(s: string) {
  return !!parseColor(s);
}

// function rgbToString(c: RgbColor) {
//   return colorString.to.hex([c.R, c.G, c.B, c.A]);
// }

export function diff(a: RgbColor, b: RgbColor) {
  // var cd = require('color-difference');
  // return cd.compare(rgbToString(a), rgbToString(b));
  return colorDiff.diff(
    colorDiff.rgba_to_lab(a),
    colorDiff.rgba_to_lab(b)
  )
}

export function parseDimen(s: string) {
  const parts = /^([\d.]+)(px|pt|em|rem|%)$/.exec(s);
  return parts && {
    value: Number(parts[1]),
    unit: parts[2],
  }
}

export function isDimen(s: string) {
  return !!parseDimen(s);
}

type filterSortVal = { keep: boolean, sortValue: any };
export function filterSort<T>(a: T[], cb: (a: T) => (filterSortVal | false)) : T[] {
  return chain(a)
    .map(o => [o, cb(o)] as [T, filterSortVal])
    .filter(tuple => tuple[1] && tuple[1].keep)
    .sortBy(tuple => tuple[1].sortValue)
    .map(tuple => tuple[0])
    .value();
}