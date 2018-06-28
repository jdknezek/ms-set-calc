import * as Data from "./Data";
import * as Monster from "./Monster";

class Field {
  distance: number;
  monsters: Monster.Monster[];

  constructor(record: Data.Record) {
    this.distance = +record.startDistance;
    this.monsters = Data.parseInts(record.encount1st2nd3rd, 3)
      .concat(Data.parseInts(record.encount4th5thBoss, 3))
      .filter(id => id !== 0)
      .map(id => Monster.byID[id]);

    const bossID = Data.parseInt(record.encount4th5thBoss, 6, 3);
    if (bossID !== 0) {
      Monster.byID[bossID].boss = true;
    }
  }
}

export const byDistance = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/fields.csv`, 'utf8')
).map(record => new Field(record));

export function populateDistances() {
  for (let i = byDistance.length - 1; i >= 0; i--) {
    const field = byDistance[i];

    for (let monster of field.monsters) {
      monster.distance = field.distance;
    }
  }
}
