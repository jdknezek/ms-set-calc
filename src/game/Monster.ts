import * as Data from "./Data";
import * as Skill from "./Skill";

export class Monster {
  id: number;
  name: string;
  rarity: number;
  skills: Skill.Skill[];
  distance: number;

  constructor(record: Data.Record) {
    this.id = +record.monsterId;
    this.name = record.nameEng;
    this.rarity = +record.lukExpRare.slice(7, 10);
    this.skills = Skill.byIDs(record.petSkill1st2nd3rd);
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/monsters.csv`, 'utf8')
).map(record => new Monster(record));

export const byName = byID.reduce((byName, monster) => {
  byName[monster.name] = monster;
  return byName;
}, {} as { [name: string]: Monster });
