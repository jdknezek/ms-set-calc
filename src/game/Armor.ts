import * as Data from "./Data";
import * as Element from "./Element";
import * as Monster from "./Monster";
import * as Skill from "./Skill";
import * as Stat from "./Stat";

export class Armor {
  id: number;
  name: string;
  stats: Stat.Stats;
  weight: number;
  elements: Element.Elements;
  skills: Skill.Skill[];
  shopDistance: number;
  droppedBy: Monster.Monster[];

  constructor(record: Data.Record) {
    this.id = +record.armorId;
    this.name = record.nameEng;
    this.stats = {
      [Stat.StatID.DEF]: Data.parseInt(record.physicalElementalWeight, 0, 3) / 10,
      [Stat.StatID.MEN]: Data.parseInt(record.physicalElementalWeight, 3, 3) / 10
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
  require('fs').readFileSync(`${__dirname}/data/armors.csv`, 'utf8')
).map(record => new Armor(record));

export const byName = byID.reduce((byName, armor) => {
  byName[armor.name] = armor;
  return byName;
}, {} as { [name: string]: Armor });
