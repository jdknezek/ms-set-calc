import * as Data from "./Data";
import * as Monster from "./Monster";
import * as Skill from "./Skill";

export class Accessory {
  id: number;
  name: string;
  skills: Skill.Skill[];
  info: string | undefined;
  shopDistance: number;
  droppdBy: Monster.Monster[];

  constructor(record: Data.Record) {
    this.id = +record.accessoryId;
    this.name = record.nameEng;
    this.skills = Skill.byIDs(record.skill1st2nd3rd);
    this.info = record.infoEng || undefined;
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/accessories.csv`, 'utf8')
).map(record => new Accessory(record));

export const byName = byID.reduce((byName, accessory) => {
  byName[accessory.name] = accessory;
  return byName;
}, {} as { [name: string]: Accessory });
