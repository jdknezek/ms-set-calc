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
  skills: Skill.Skill[];
  skillLevels: number[];

  constructor() {
    this.skillCalcMap = new SkillCalcMap();
    this.skills = new Array(3);
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
      this.skills[i] = Skill.byID[0];
      this.skillLevels[i] = 1;
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
    for (let entry of this.skillCalcMap.entries) {
      const {skill} = entry;
      if (skill.id === 0) {
        continue;
      }
      if (entry.count >= skill.needNum) {
        this.skills[skillIndex] = skill;
        this.skillLevels[skillIndex] = 1;
        if (skill.levelupInterval > 0) {
          this.skillLevels[skillIndex] += Math.floor((entry.count - skill.needNum) / skill.levelupInterval);
          if (this.skillLevels[skillIndex] > skill.maxLevel) {
            this.skillLevels[skillIndex] = skill.maxLevel;
          }
        }
        skillIndex++;
      }
      if (skillIndex >= 3) {
        break;
      }
    }

    for (let i = skillIndex; i < 3; i++) {
      this.skills[i] = Skill.byID[0];
      this.skillLevels[i] = 1;
    }

    if (this.skills[1].id !== 0 && (this.skills[0].id === 0 || this.skills[0].id > this.skills[1].id)) {
      this.swapSkillArray(0, 1);
    }

    if (this.skills[2].id !== 0 && (this.skills[1].id === 0 || this.skills[1].id > this.skills[2].id)) {
      this.swapSkillArray(1, 2);
    }

    if (this.skills[1].id !== 0 && (this.skills[0].id === 0 || this.skills[0].id > this.skills[1].id)) {
      this.swapSkillArray(0, 1);
    }
  }

  swapSkillArray(i: number, j: number) {
    var tempSkill = this.skills[i];
    var tempLevel = this.skillLevels[i];
    this.skills[i] = this.skills[j];
    this.skillLevels[i] = this.skillLevels[j];
    this.skills[j] = tempSkill;
    this.skillLevels[j] = tempLevel;
  }
}

type SkillCalcMapEntry = {
  sequence: number;
  skill: Skill.Skill;
  count: number;
}

class SkillCalcMap {
  entries: SkillCalcMapEntry[];

  constructor() {
    this.reset();
  }

  reset() {
    this.entries = [];
  }

  add(skill: Skill.Skill) {
    for (let entry of this.entries) {
      if (entry.skill === skill) {
        entry.count++;
        return;
      }
    }
    this.entries.push({
      sequence: this.entries.length,
      skill,
      count: 1,
    });
  }

  sort() {
    this.entries.sort((a, b) => {
      let comparison = b.count - a.count;
      if (comparison !== 0) return comparison;
      return a.sequence - b.sequence;
    })
  }
}
