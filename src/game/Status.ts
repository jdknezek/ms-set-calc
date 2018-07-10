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
  bonusStats: Stat.Stats;
  weight: number;
  elements: Element.Elements;
  bonusElements: Element.Elements;
  skillCalcMap: SkillCalcMap;
  skillLevels: Skill.SkillLevel[];

  constructor() {
    this.weapon = Weapon.byID[0];
    this.armor = Armor.byID[0];
    this.shield = Shield.byID[0];
    this.accessory = Accessory.byID[0];
    this.pet = Monster.byID[0];
    this.stats = {};
    this.bonusStats = {};
    this.elements = {};
    this.bonusElements = {};
    this.skillCalcMap = new SkillCalcMap();
    this.skillLevels = [
      { skill: Skill.byID[0], level: 1 },
      { skill: Skill.byID[0], level: 1 },
      { skill: Skill.byID[0], level: 1 },
    ];
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

  getStat(statID: Stat.StatID) {
    return this.stats[statID] + this.bonusStats[statID];
  }

  getElement(elementID: Element.ElementID) {
    return this.elements[elementID] + this.bonusElements[elementID];
  }

  updateSkills() {
    this.skillCalcMap.reset();
    for (let i = 0; i < this.skillLevels.length; i++) {
      this.skillLevels[i].skill = Skill.byID[0];
      this.skillLevels[i].level = 1;
    }

    this.addSkills(this.weapon.skills);
    this.addSkills(this.armor.skills);
    this.addSkills(this.shield.skills);
    this.addSkills(this.accessory.skills);
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

  updateStats() {
    for (let i = 0; i < Stat.StatID.NUM; i++) {
      this.stats[i] = 0;
      this.bonusStats[i] = 0;
    }

    for (let i = 0; i < Element.ElementID.NUM; i++) {
      this.elements[i] = 0;
      this.bonusElements[i] = 0;
    }

    this.weight = 0;

    this.addStats(this.weapon.stats);
    this.addElements(this.weapon.elements);
    this.weight += this.weapon.weight;

    this.addStats(this.armor.stats);
    this.addElements(this.armor.elements);
    this.weight += this.armor.weight;

    this.addStats(this.shield.stats);
    this.addElements(this.shield.elements);
    this.weight += this.shield.weight;

    this.addStats(this.accessory.stats);
    this.addElements(this.accessory.elements);
    this.weight += this.accessory.weight;

    this.addStats(this.pet.stats);
    this.addElements(this.pet.elements);

    let lukAssignment = false;
    let heatSaber = 0;
    let aquaSaber = 0;
    let earthSaber = 0;
    let holySaber = 0;
    let blackSaber = 0;
    let heatWall = 0;
    let aquaWall = 0;
    let earthWall = 0;
    let holyWall = 0;
    let blackWall = 0;
    for (let { skill, level } of this.skillLevels) {
      switch (skill.id) {
        case Skill.SkillID.ADD_HP:
          this.bonusStats[Stat.StatID.HP] += this.stats[Stat.StatID.HP] * skill.levelupValue * 0.01 * level;
          break;
        case Skill.SkillID.ADD_ATK:
          this.bonusStats[Stat.StatID.ATK] += this.stats[Stat.StatID.ATK] * skill.levelupValue * 0.01 * level;
          break;
        case Skill.SkillID.ADD_DEF:
          this.bonusStats[Stat.StatID.DEF] += this.stats[Stat.StatID.DEF] * skill.levelupValue * 0.01 * level;
          break;
        case Skill.SkillID.ADD_INT:
          this.bonusStats[Stat.StatID.INT] += this.stats[Stat.StatID.INT] * skill.levelupValue * 0.01 * level;
          break;
        case Skill.SkillID.ADD_MEN:
          this.bonusStats[Stat.StatID.MEN] += this.stats[Stat.StatID.MEN] * skill.levelupValue * 0.01 * level;
          break;
        case Skill.SkillID.ADD_SPD:
          this.bonusStats[Stat.StatID.SPD] += this.stats[Stat.StatID.SPD] * skill.levelupValue * 0.01 * level;
          break;
        case Skill.SkillID.ADD_LUK:
          this.bonusStats[Stat.StatID.LUK] += this.stats[Stat.StatID.LUK] * skill.levelupValue * 0.01 * level;
          break;
        case Skill.SkillID.ADD_FIRE:
          this.bonusElements[Element.ElementID.FIRE] += skill.levelupValue * level;
          break;
        case Skill.SkillID.ADD_WATER:
          this.bonusElements[Element.ElementID.WATER] += skill.levelupValue * level;
          break;
        case Skill.SkillID.ADD_LEAF:
          this.bonusElements[Element.ElementID.LEAF] += skill.levelupValue * level;
          break;
        case Skill.SkillID.ADD_LIGHT:
          this.bonusElements[Element.ElementID.LIGHT] += skill.levelupValue * level;
          break;
        case Skill.SkillID.ADD_DARK:
          this.bonusElements[Element.ElementID.DARK] += skill.levelupValue * level;
          break;
        case Skill.SkillID.FULL_GUARD:
          this.bonusStats[Stat.StatID.ATK] += -this.stats[Stat.StatID.ATK] / 2;
          this.bonusStats[Stat.StatID.DEF] += this.stats[Stat.StatID.DEF] * 0.5;
          break;
        case Skill.SkillID.NO_GUARD:
          this.bonusStats[Stat.StatID.DEF] += -this.stats[Stat.StatID.DEF] / 2;
          this.bonusStats[Stat.StatID.ATK] += this.stats[Stat.StatID.ATK] * 0.5;
          break;
        case Skill.SkillID.WALL:
          this.bonusStats[Stat.StatID.MEN] += -this.stats[Stat.StatID.MEN] / 2;
          this.bonusStats[Stat.StatID.DEF] += this.stats[Stat.StatID.DEF] * 0.5;
          break;
        case Skill.SkillID.MAGIC_BARRIER:
          this.bonusStats[Stat.StatID.DEF] += -this.stats[Stat.StatID.DEF] / 2;
          this.bonusStats[Stat.StatID.MEN] += this.stats[Stat.StatID.MEN] * 0.5;
          break;
        case Skill.SkillID.MINDLESSLY:
          this.bonusStats[Stat.StatID.SPD] += this.stats[Stat.StatID.SPD] * 0.5;
          this.bonusStats[Stat.StatID.INT] += -this.stats[Stat.StatID.INT] / 2;
          this.bonusStats[Stat.StatID.MEN] += -this.stats[Stat.StatID.INT] / 2;
          break;
        case Skill.SkillID.LUK_ASSIGNMENT:
          lukAssignment = true;
          break;
        case Skill.SkillID.HEAT_SABER:
          heatSaber = level;
          break;
        case Skill.SkillID.AQUA_SABER:
          aquaSaber = level;
          break;
        case Skill.SkillID.EARTH_SABER:
          earthSaber = level;
          break;
        case Skill.SkillID.HOLY_SABER:
          holySaber = level;
          break;
        case Skill.SkillID.BLACK_SABER:
          blackSaber = level;
          break;
        case Skill.SkillID.HEAT_WALL:
          heatWall = level;
          break;
        case Skill.SkillID.AQUA_WALL:
          aquaWall = level;
          break;
        case Skill.SkillID.EARTH_WALL:
          earthWall = level;
          break;
        case Skill.SkillID.HOLY_WALL:
          holyWall = level;
          break;
        case Skill.SkillID.BLACK_WALL:
          blackWall = level;
          break;
      }
    }
    if (lukAssignment) {
      const bonus = (this.stats[Stat.StatID.LUK] + this.bonusStats[Stat.StatID.LUK]) / 5;
      this.bonusStats[Stat.StatID.ATK] += bonus;
      this.bonusStats[Stat.StatID.DEF] += bonus;
      this.bonusStats[Stat.StatID.INT] += bonus;
      this.bonusStats[Stat.StatID.MEN] += bonus;
      this.bonusStats[Stat.StatID.SPD] += bonus;
      this.bonusStats[Stat.StatID.LUK] = -this.stats[Stat.StatID.LUK];
    }
    if (heatSaber > 0) {
      this.bonusStats[Stat.StatID.ATK] += this.getStat(Stat.StatID.ATK) * 0.001 * heatSaber * this.getElement(Element.ElementID.FIRE);
    }
    if (aquaSaber > 0) {
      this.bonusStats[Stat.StatID.ATK] += this.getStat(Stat.StatID.ATK) * 0.001 * aquaSaber * this.getElement(Element.ElementID.WATER);
    }
    if (earthSaber > 0) {
      this.bonusStats[Stat.StatID.ATK] += this.getStat(Stat.StatID.ATK) * 0.001 * earthSaber * this.getElement(Element.ElementID.LEAF);
    }
    if (holySaber > 0) {
      this.bonusStats[Stat.StatID.ATK] += this.getStat(Stat.StatID.ATK) * 0.001 * holySaber * this.getElement(Element.ElementID.LIGHT);
    }
    if (blackSaber > 0) {
      this.bonusStats[Stat.StatID.ATK] += this.getStat(Stat.StatID.ATK) * 0.001 * blackSaber * this.getElement(Element.ElementID.DARK);
    }
    if (heatWall > 0) {
      this.bonusStats[Stat.StatID.DEF] += this.getStat(Stat.StatID.DEF) * 0.001 * heatWall * this.getElement(Element.ElementID.FIRE);
    }
    if (aquaWall > 0) {
      this.bonusStats[Stat.StatID.DEF] += this.getStat(Stat.StatID.DEF) * 0.001 * aquaWall * this.getElement(Element.ElementID.WATER);
    }
    if (earthWall > 0) {
      this.bonusStats[Stat.StatID.DEF] += this.getStat(Stat.StatID.DEF) * 0.001 * earthWall * this.getElement(Element.ElementID.LEAF);
    }
    if (holyWall > 0) {
      this.bonusStats[Stat.StatID.DEF] += this.getStat(Stat.StatID.DEF) * 0.001 * holyWall * this.getElement(Element.ElementID.LIGHT);
    }
    if (blackWall > 0) {
      this.bonusStats[Stat.StatID.DEF] += this.getStat(Stat.StatID.DEF) * 0.001 * blackWall * this.getElement(Element.ElementID.DARK);
    }
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
