import * as Data from "./Data";

export enum SkillID {
  ZERO,
  ADD_HP,
  ADD_ATK,
  ADD_DEF,
  ADD_INT,
  ADD_MEN,
  ADD_SPD,
  ADD_LUK,
  ADD_FIRE,
  ADD_WATER,
  ADD_LEAF,
  ADD_LIGHT,
  ADD_DARK,
  ADD_MOVE,
  ADD_TACKLE,
  LUCKY_PUNCH,
  ACROBAT,
  BODYSLAM,
  TACTICS,
  FENG_SHUI,
  HEAT_SABER,
  AQUA_SABER,
  EARTH_SABER,
  HOLY_SABER,
  BLACK_SABER,
  HEAT_WALL,
  AQUA_WALL,
  EARTH_WALL,
  HOLY_WALL,
  BLACK_WALL,
  COUNTER,
  REFLECTION,
  RECOVERY_MAGIC,
  SPONTANEOUS_RECOVERY,
  PROTECTION_RECOVERY,
  POISON_ATTACK,
  STUN_ATTACK,
  CRITICAL_UP,
  EXP_UP,
  DROP_UP,
  GOLD_UP,
  DEATH_MARCH,
  PROVOKE,
  RUSH,
  ESCAPE,
  GUTS,
  FULL_GUARD,
  NO_GUARD,
  WALL,
  MAGIC_BARRIER,
  MINDLESSLY,
  LUK_ASSIGNMENT,
  WEAK_UP,
  RESISTANCE_UP,
  SURPRISE_ATTACK,
  FINISH_ATTACK,
  RANDOM_ATTACK,
  POWER_STEP,
  SPEED_STEP,
  VERVE,
  RAGE,
  GUARD_POSE,
  LOVELY,
  THIEVES_EYE,
  NUM
}

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

export interface SkillLevel {
  skill: Skill;
  level: number;
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/skills.csv`, 'utf8')
).map(record => new Skill(record));

export const byName = byID.reduce((byName, skill) => {
  byName[skill.name] = skill;
  return byName;
}, {} as { [name: string]: Skill });

export function parseIDs(ids: string) {
  return Data.parseInts(ids, 3);
}

export function decode(ids: string) {
  return parseIDs(ids)
    .filter(id => id !== 0)
    .map(id => byID[id]);
}
