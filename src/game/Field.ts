import * as Data from "./Data";
import * as Monster from "./Monster";

class Field {
  distance: number;
  monsters: Monster.Monster[];
  boss: Monster.Monster;

  constructor(record: Data.Record) {
    this.distance = +record.startDistance;
    this.monsters = Data.parseInts(record.encount1st2nd3rd, 3)
      .concat(Data.parseInts(record.encount4th5thBoss, 2))
      .filter(id => id !== 0)
      .map(id => Monster.byID[id]);
    this.boss = Monster.byID[Data.parseInt(record.encount4th5thBoss, 6, 3)];
    if (this.boss.id !== 0) this.boss.boss = true;
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

    if (field.boss.id !== 0) {
      field.boss.distance = field.distance;
    }
  }
}
