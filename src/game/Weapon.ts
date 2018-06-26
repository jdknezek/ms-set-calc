import * as Data from "./Data";
import * as Skill from "./Skill";

export class Weapon {
  id: number;
  name: string;
  skills: Skill.Skill[];
  shopDistance: number;

  constructor(record: Data.Record) {
    this.id = +record.weaponId;
    this.name = record.nameEng;
    this.skills = Skill.byIDs(record.skill1st2nd3rd);
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/weapons.csv`, 'utf8')
).map(record => new Weapon(record));

export const byName = byID.reduce((byName, weapon) => {
  byName[weapon.name] = weapon;
  return byName;
}, {} as { [name: string]: Weapon });
