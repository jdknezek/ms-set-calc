import * as Armor from "./game/Armor";
import * as Combo from "./game/Combo";
import * as Skill from "./game/Skill";
import * as Status from "./game/Status";
import * as Weapon from "./game/Weapon";

interface Equipment {
  id: number;
  skills: Skill.Skill[];
}

export class Filter {
  skillLevels: Skill.SkillLevel[];

  constructor() {
    this.skillLevels = [
      { skill: Skill.byID[0], level: 1 },
      { skill: Skill.byID[0], level: 1 },
      { skill: Skill.byID[0], level: 1 }
    ];
  }

  hasAnySkill(skills: Skill.Skill[]) {
    return this.skillLevels.some(({skill}) => skill.id !== 0 && skills.indexOf(skill) !== -1);
  }

  comboHasAnySkill(weaponID: number, armorID: number) {
    return this.hasAnySkill(Combo.getSkills(weaponID, armorID));
  }

  weaponComboHasAnySkill(weapon: Weapon.Weapon) {
    return Armor.byID.slice(1).some(armor => this.comboHasAnySkill(weapon.id, armor.id));
  }

  armorComboHasAnySkill(armor: Armor.Armor) {
    return Weapon.byID.slice(1).some(weapon => this.comboHasAnySkill(weapon.id, armor.id));
  }

  filterEquipment(equipment: Equipment) {
    if (this.hasAnySkill(equipment.skills)) return true;

    if (equipment instanceof Weapon.Weapon) {
      return this.weaponComboHasAnySkill(equipment);
    } else if (equipment instanceof Armor.Armor) {
      return this.armorComboHasAnySkill(equipment);
    }

    return false;
  }

  filterEquipments<T extends Equipment>(equipments: T[]): T[] {
    return equipments.filter(equipment => this.filterEquipment(equipment));
  }

  checkStatus(status: Status.Status) {
    return this.skillLevels.every(({ skill, level }) => {
      if (skill.id === 0) {
        return true;
      }
      const skillLevel = status.skillLevels.find(skillLevel => skillLevel.skill === skill);
      return skillLevel != null && skillLevel.level >= level;
    });
  }
}
