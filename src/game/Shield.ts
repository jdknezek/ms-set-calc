import * as Data from "./Data";
import * as Skill from "./Skill";

export class Shield {
  id: number;
  name: string;
  skills: Skill.Skill[];
  shopDistance: number;

  constructor(record: Data.Record) {
    this.id = +record.shieldId;
    this.name = record.nameEng;
    this.skills = Skill.byIDs(record.skill1st2nd3rd);
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/shields.csv`, 'utf8')
).map(record => new Shield(record));

export const byName = byID.reduce((byName, shield) => {
  byName[shield.name] = shield;
  return byName;
}, {} as { [name: string]: Shield });
