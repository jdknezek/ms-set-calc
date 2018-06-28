import * as Data from "./Data";
import * as Monster from "./Monster";

class Field {
  distance: number;
  monsterIDs: number[];

  constructor(record: Data.Record) {
    this.distance = +record.startDistance;
    this.monsterIDs = Data.parseInts(record.encount1st2nd3rd, 3)
      .concat(Data.parseInts(record.encount4th5thBoss, 3))
      .filter(id => id !== 0);
  }
}

export const byDistance = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/fields.csv`, 'utf8')
).map(record => new Field(record));

export function populateDistances() {
  for (let field of byDistance) {
    for (let monsterID of field.monsterIDs) {
      Monster.byID[monsterID].distance = field.distance;
    }
  }
}
