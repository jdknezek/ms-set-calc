import * as Accessory from "./Accessory";
import * as Armor from "./Armor";
import * as Data from "./Data";
import * as Element from "./Element";
import * as Shield from "./Shield";
import * as Skill from "./Skill";
import * as Stat from "./Stat";
import * as Weapon from "./Weapon";

export class Monster {
  id: number;
  name: string;
  spawnRatio: number;
  stats: Stat.Stats;
  elements: Element.Elements;
  skills: Skill.Skill[];
  weapon: Weapon.Weapon;
  armor: Armor.Armor;
  shield: Shield.Shield;
  accessory: Accessory.Accessory;
  distance: number;
  boss: boolean;

  constructor(record: Data.Record) {
    this.id = +record.monsterId;
    this.name = record.nameEng;
    this.spawnRatio = Data.parseInt(record.lukExpRare, 6, 3);
    this.stats = Stat.decode(record.petStatus1st2nd3rd);
    this.elements = Element.decode(record.petElm1st2nd3rd);
    this.skills = Skill.decode(record.petSkill1st2nd3rd);
    this.weapon = Weapon.byID[Data.parseInt(record.dropWpnAmrSld, 0, 3)];
    this.weapon.droppedBy.push(this);
    this.armor = Armor.byID[Data.parseInt(record.dropWpnAmrSld, 3, 3)];
    this.armor.droppedBy.push(this);
    this.shield = Shield.byID[Data.parseInt(record.dropWpnAmrSld, 6, 3)];
    this.shield.droppedBy.push(this);
    this.accessory = Accessory.byID[Data.parseInt(record.dropAceGemTmp, 0, 3)];
    this.accessory.droppedBy.push(this);
    this.boss = false;
  }

  toString() {
    return `${this.name}${this.boss ? ' (BOSS)' : ''}`;
  }
}

export const byID = Data.parseText(
  require('fs').readFileSync(`${__dirname}/data/monsters.csv`, 'utf8')
).map(record => new Monster(record));

export const byName = byID.reduce((byName, monster) => {
  byName[monster.name] = monster;
  return byName;
}, {} as { [name: string]: Monster });
