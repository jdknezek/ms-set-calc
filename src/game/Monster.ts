import * as Data from "./Data";
import * as Element from "./Element";
import * as Skill from "./Skill";
import * as Stat from "./Stat";

export class Monster {
  id: number;
  name: string;
  rarity: number;
  stats: Stat.Stats;
  elements: Element.Elements;
  skills: Skill.Skill[];
  distance: number;

  constructor(record: Data.Record) {
    this.id = +record.monsterId;
    this.name = record.nameEng;
    this.rarity = Data.parseInt(record.lukExpRare, 6, 3);
    this.stats = Stat.decode(record.petStatus1st2nd3rd);
    this.elements = Element.decode(record.petElm1st2nd3rd);
    this.skills = Skill.decode(record.petSkill1st2nd3rd);
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/monsters.csv`, 'utf8')
).map(record => new Monster(record));

export const byName = byID.reduce((byName, monster) => {
  byName[monster.name] = monster;
  return byName;
}, {} as { [name: string]: Monster });
