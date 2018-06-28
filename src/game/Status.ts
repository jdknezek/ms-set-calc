import * as Accessory from "./Accessory";
import * as Armor from "./Armor";
import * as Combo from "./Combo";
import * as Element from "./Element";
import * as Monster from "./Monster";
import * as Shield from "./Shield";
import * as Skill from "./Skill";
import * as Stat from "./Stat";
import * as Weapon from "./Weapon";

export class Status {
  weapon: Weapon.Weapon;
  armor: Armor.Armor;
  shield: Shield.Shield;
  accessory: Accessory.Accessory;
  pet: Monster.Monster;

  stats: Stat.Stats;
  weight: number;
  elements: Element.Elements;
  skillCalcMap: SkillCalcMap;
  skillLevels: Skill.SkillLevel[];

  constructor() {
    this.weapon = Weapon.byID[0];
    this.armor = Armor.byID[0];
    this.shield = Shield.byID[0];
    this.accessory = Accessory.byID[0];
    this.pet = Monster.byID[0];
    this.skillCalcMap = new SkillCalcMap();
  }

  addStats(stats: Stat.Stats) {
    for (let key in stats) {
      this.stats[key] += stats[key];
    }
  }

  addElements(elements: Element.Elements) {
    for (let key in elements) {
      this.elements[key] += elements[key];
    }
  }

  addSkills(skills: Skill.Skill[]) {
    for (let skill of skills) {
      this.skillCalcMap.add(skill);
    }
  }

  updateStats() {
    this.stats = {};
    for (let i = 0; i < Stat.StatID.NUM; i++) {
      this.stats[i] = 0;
    }

    this.elements = {};
    for (let i = 0; i < Element.ElementID.NUM; i++) {
      this.elements[i] = 0;
    }

    this.weight = 0;

    this.skillCalcMap.reset();
    this.skillLevels = new Array(3);
    for (let i = 0; i < this.skillLevels.length; i++) {
      this.skillLevels[i] = {
        skill: Skill.byID[0],
        level: 1,
      };
    }

    this.addStats(this.weapon.stats);
    this.addElements(this.weapon.elements);
    this.weight += this.weapon.weight;
    this.addSkills(this.weapon.skills);

    this.addStats(this.armor.stats);
    this.addElements(this.armor.elements);
    this.weight += this.armor.weight;
    this.addSkills(this.armor.skills);

    this.addStats(this.shield.stats);
    this.addElements(this.shield.elements);
    this.weight += this.shield.weight;
    this.addSkills(this.shield.skills);

    this.addStats(this.accessory.stats);
    this.addElements(this.accessory.elements);
    this.weight += this.accessory.weight;
    this.addSkills(this.accessory.skills);

    this.addStats(this.pet.stats);
    this.addElements(this.pet.elements);
    this.addSkills(this.pet.skills);

    this.addSkills(Combo.getSkills(this.weapon.id, this.armor.id));

    this.skillCalcMap.sort();
    let skillIndex = 0;
    for (let item of this.skillCalcMap.items) {
      const { skill, level } = item;
      if (skill.id === 0) {
        continue;
      }
      if (level >= skill.needNum) {
        const skillLevel = this.skillLevels[skillIndex];
        skillLevel.skill = skill;
        skillLevel.level = 1;
        if (skill.levelupInterval > 0) {
          skillLevel.level += Math.floor((level - skill.needNum) / skill.levelupInterval);
          if (skillLevel.level > skill.maxLevel) {
            skillLevel.level = skill.maxLevel;
          }
        }
        skillIndex++;
      }
      if (skillIndex >= 3) {
        break;
      }
    }

    for (let i = skillIndex; i < 3; i++) {
      this.skillLevels[i].skill = Skill.byID[0];
      this.skillLevels[i].level = 1;
    }

    this.skillLevels.sort((a, b) => a.skill.id === 0
      ? b.skill.id === 0
        ? 0
        : 1
      : b.skill.id === 0
        ? -1
        : a.skill.id - b.skill.id
    );
  }
}

interface SkillCalcMapItem extends Skill.SkillLevel {
  sequence: number;
}

class SkillCalcMap {
  items: SkillCalcMapItem[];

  constructor() {
    this.reset();
  }

  reset() {
    this.items = [];
  }

  add(skill: Skill.Skill) {
    for (let item of this.items) {
      if (item.skill === skill) {
        item.level++;
        return;
      }
    }
    this.items.push({
      sequence: this.items.length,
      skill,
      level: 1,
    });
  }

  sort() {
    this.items.sort((a, b) => {
      let comparison = b.level - a.level;
      if (comparison !== 0) return comparison;
      return a.sequence - b.sequence;
    })
  }
}
