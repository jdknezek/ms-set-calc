import * as Accessory from "./Accessory";
import * as Armor from "./Armor";
import * as Combo from "./Combo";
import * as Monster from "./Monster";
import * as Shield from "./Shield";
import * as Skill from "./Skill";
import * as Weapon from "./Weapon";

export class Status {
  weapon: Weapon.Weapon;
  armor: Armor.Armor;
  shield: Shield.Shield;
  accessory: Accessory.Accessory;
  pet: Monster.Monster;
  skillCalcMap: SkillCalcMap;
  skillLevels: Skill.SkillLevel[];

  constructor() {
    this.skillCalcMap = new SkillCalcMap();
    this.skillLevels = new Array(3);
    this.reset();
  }

  reset() {
    this.weapon = Weapon.byID[0];
    this.armor = Armor.byID[0];
    this.shield = Shield.byID[0];
    this.accessory = Accessory.byID[0];
    this.pet = Monster.byID[0];
    this.resetSkillCalcMap();
    for (let i = 0; i < 3; i++) {
      this.skillLevels[i] = {
        skill: Skill.byID[0],
        level: 1
      };
    }
  }

  resetSkillCalcMap() {
    this.skillCalcMap.reset();
  }

  addSkillCalcMap(skill: Skill.Skill) {
    this.skillCalcMap.add(skill);
  }

  updateStats() {
    this.resetSkillCalcMap();

    for (let skill of this.weapon.skills) {
      this.addSkillCalcMap(skill);
    }

    for (let skill of this.armor.skills) {
      this.addSkillCalcMap(skill);
    }

    for (let skill of this.shield.skills) {
      this.addSkillCalcMap(skill);
    }

    for (let skill of this.accessory.skills) {
      this.addSkillCalcMap(skill);
    }

    for (let skill of this.pet.skills) {
      this.addSkillCalcMap(skill);
    }

    for (let skill of Combo.getSkills(this.weapon.id, this.armor.id)) {
      this.addSkillCalcMap(skill);
    }

    this.skillCalcMap.sort();
    let skillIndex = 0;
    for (let item of this.skillCalcMap.items) {
      const {skill, level} = item;
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
