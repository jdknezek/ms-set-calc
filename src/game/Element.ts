import * as Data from "./Data";

export enum ElementID {
  NONE,
  FIRE,
  WATER,
  LEAF,
  LIGHT,
  DARK,
  NUM
}

export interface Elements {
  [elementID: number]: number;
}

export function decode(encoded: string, count = 3): Elements {
  const elements: Elements = {};
  for (let i = 0; i < count; i++) {
    const start = i * 3;
    const id = Data.parseInt(encoded, start, 1);
    if (id <= ElementID.NONE) continue;
    elements[id] = Data.parseInt(encoded, start + 1, 2);
  }
  return elements;
}
