import * as Data from "./Data";
import * as Element from "./Element";
import * as Monster from "./Monster";
import * as Skill from "./Skill";
import * as Stat from "./Stat";

export class Accessory {
  id: number;
  name: string;
  stats: Stat.Stats;
  weight: number;
  elements: Element.Elements;
  skills: Skill.Skill[];
  info: string | undefined;
  shopDistance: number;
  droppedBy: Monster.Monster[];

  constructor(record: Data.Record) {
    this.id = +record.accessoryId;
    this.name = record.nameEng;
    this.stats = Stat.decode(record.status1st2ndWeight, 2);
    this.weight = Data.parseInt(record.status1st2ndWeight, 6, 3);
    this.elements = Element.decode(record.elm1st2nd3rd);
    this.skills = Skill.decode(record.skill1st2nd3rd);
    this.info = record.infoEng || undefined;
    this.droppedBy = [];
  }

  toString() {
    return this.name;
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/accessories.csv`, 'utf8')
).map(record => new Accessory(record));

export const byName = byID.reduce((byName, accessory) => {
  byName[accessory.name] = accessory;
  return byName;
}, {} as { [name: string]: Accessory });
