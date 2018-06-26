import * as Accessory from "./game/Accessory";
import * as Armor from "./game/Armor";
import * as Combo from "./game/Combo";
import * as Monster from "./game/Monster";
import * as Shield from "./game/Shield";
import * as Skill from "./game/Skill";
import * as Status from "./game/Status";
import * as Weapon from "./game/Weapon";
import * as SkillFilter from "./SkillFilter";
import * as Collection from "./Collection";
import * as Iter from "./Iter";

export type Set = {
  weapon: Weapon.Weapon;
  armor: Armor.Armor;
  shield: Shield.Shield;
  accessory: Accessory.Accessory;
  pet: Monster.Monster;
  skills: SkillFilter.SkillLevel[];
}

function makeSet(status: Status.Status): Set {
  return {
    weapon: status.weapon,
    armor: status.armor,
    shield: status.shield,
    accessory: status.accessory,
    pet: status.pet,
    skills: status.skills.map((skill, index) => ({skill, level: status.skillLevels[index]}))
  };
}

export class Calculator {
  collection: Collection.Collection;
  filter: SkillFilter.Filter;

  constructor(collection: Collection.Collection) {
    this.collection = collection;
    this.filter = new SkillFilter.Filter();
  }

  getWeapons() {
    return this.filter.filterEquipments(this.collection.weapons).sort((a, b) => a.name.localeCompare(b.name)).concat(Weapon.byID[0]);
  }

  getArmors() {
    return this.filter.filterEquipments(this.collection.armors).sort((a, b) => a.name.localeCompare(b.name)).concat(Armor.byID[0]);
  }

  getShields() {
    return this.filter.filterEquipments(this.collection.shields).sort((a, b) => a.name.localeCompare(b.name)).concat(Shield.byID[0]);
  }

  getAccessories() {
    return this.filter.filterEquipments(this.collection.accessories).sort((a, b) => a.name.localeCompare(b.name)).concat(Accessory.byID[0]);
  }

  getPets() {
    return this.filter.filterEquipments(this.collection.pets).sort((a, b) => a.name.localeCompare(b.name)).concat(Monster.byID[0]);
  }

  countPossibleSets() {
    return this.getWeapons().length *
      this.getArmors().length *
      this.getShields().length *
      this.getAccessories().length *
      this.getPets().length;
  }

  calculateSets: () => IterableIterator<Set>;
}

Calculator.prototype.calculateSets = function* () {
  let start = new Date();
  let yielded = 0;
  const status = new Status.Status;
  for (let weapon of this.getWeapons()) {
    status.weapon = weapon;
    for (let armor of this.getArmors()) {
      status.armor = armor;
      for (let shield of this.getShields()) {
        status.shield = shield;
        for (let accessory of this.getAccessories()) {
          status.accessory = accessory;
          for (let pet of this.getPets()) {
            status.pet = pet;

            status.updateStats();
            if (this.filter.checkStatus(status)) {
              yield makeSet(status);
              yielded++;
            }
          }
        }
      }
    }
  }
  console.log('generated', yielded, 'sets in', new Date().valueOf() - start.valueOf(), 'ms');
}
