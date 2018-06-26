import * as Data from "./Data";

export enum Type {
  ZERO,
  ADD_VALUE,
  ADD_PERCENT,
  ADD_LEVEL,
  PERCENT,
  LEVEL,
  SPECIAL
}

export class Skill {
  id: number;
  type: Type;
  name: string;
  needNum: number;
  levelupInterval: number;
  levelupValue: number;
  maxLevel: number;
  info: string;

  constructor(record: Data.Record) {
    this.id = +record.skillId;
    this.type = +record.skillType;
    this.name = record.nameEng;
    this.needNum = +record.needNum;
    this.levelupInterval = +record.levelupInterval;
    this.levelupValue = +record.levelupValue;
    this.maxLevel = +record.maxLevel;
    this.info = record.infoEng;
  }

  toString(level: number) {
    switch (this.type) {
      case Type.ADD_VALUE: return `${this.name} +${level * this.levelupValue}`;
      case Type.ADD_PERCENT: return `${this.name} +${level * this.levelupValue}%`;
      case Type.ADD_LEVEL: return `${this.name} +Lv${level * this.levelupValue}`;
      case Type.PERCENT: return `${this.name} (${level * this.levelupValue}%)`;
      case Type.LEVEL: return `${this.name} (Lv${level * this.levelupValue})`;
      case Type.SPECIAL: return this.name;
      default: return '';
    }
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/skills.csv`, 'utf8')
).map(record => new Skill(record));

export const byName = byID.reduce((byName, skill) => {
  byName[skill.name] = skill;
  return byName;
}, {} as { [name: string]: Skill });

export function byIDs(ids: string) {
  return Data.parseIDs(ids)
    .filter(id => id !== 0)
    .map(id => byID[id]);
}
