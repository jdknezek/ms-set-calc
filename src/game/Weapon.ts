import * as Data from "./Data";
import * as Element from "./Element";
import * as Monster from "./Monster";
import * as Skill from "./Skill";
import * as Stat from "./Stat";

export class Weapon {
  id: number;
  name: string;
  stats: Stat.Stats;
  weight: number;
  elements: Element.Elements;
  skills: Skill.Skill[];
  shopDistance: number;
  droppedBy: Monster.Monster[];

  constructor(record: Data.Record) {
    this.id = +record.weaponId;
    this.name = record.nameEng;
    this.stats = {
      [Stat.StatID.ATK]: Data.parseInt(record.physicalElementalWeight, 0, 3) * 0.1,
      [Stat.StatID.INT]: Data.parseInt(record.physicalElementalWeight, 3, 3) * 0.1
    };
    this.weight = Data.parseInt(record.physicalElementalWeight, 6, 3);
    this.elements = Element.decode(record.elm1st2nd3rd);
    this.skills = Skill.decode(record.skill1st2nd3rd);
    this.droppedBy = [];
  }

  toString() {
    return this.name;
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/weapons.csv`, 'utf8')
).map(record => new Weapon(record));

export const byName = byID.reduce((byName, weapon) => {
  byName[weapon.name] = weapon;
  return byName;
}, {} as { [name: string]: Weapon });
