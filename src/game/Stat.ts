import * as Data from "./Data";

export enum StatID {
  HP,
  ATK,
  DEF,
  INT,
  MEN,
  SPD,
  LUK,
  NUM
}

export interface Stats {
  [statID: number]: number;
}

export function getAddValue(rawValue: number) {
  return Math.floor(rawValue * 0.1 + 0.5);
}

export function decode(encoded: string, count = 3): Stats {
  const stats: Stats = {};
  for (let i = 0; i < count; i++) {
    const start = i * 3;
    const id = Data.parseInt(encoded, start, 1);
    if (id >= StatID.NUM) continue;
    stats[id] = Data.parseInt(encoded, start + 1, 2) / 10;
    if (id === StatID.HP) stats[id] *= 5;
  }
  return stats;
}
