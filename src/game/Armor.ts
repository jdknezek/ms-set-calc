import * as Data from "./Data";
import * as Monster from "./Monster";
import * as Skill from "./Skill";

export class Armor {
  id: number;
  name: string;
  skills: Skill.Skill[];
  shopDistance: number;
  droppedBy: Monster.Monster[];

  constructor(record: Data.Record) {
    this.id = +record.armorId;
    this.name = record.nameEng;
    this.skills = Skill.byIDs(record.skill1st2nd3rd);
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/armors.csv`, 'utf8')
).map(record => new Armor(record));

export const byName = byID.reduce((byName, armor) => {
  byName[armor.name] = armor;
  return byName;
}, {} as { [name: string]: Armor });
