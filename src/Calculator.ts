import * as Accessory from "./game/Accessory";
import * as Armor from "./game/Armor";
import * as Collection from "./Collection";
import * as Element from "./game/Element";
import * as Field from "./game/Field";
import * as Monster from "./game/Monster";
import * as Shield from "./game/Shield";
import * as Shop from "./game/Shop";
import * as Skill from "./game/Skill";
import * as SkillFilter from "./SkillFilter";
import * as Stat from "./game/Stat";
import * as Status from "./game/Status";
import * as Weapon from "./game/Weapon";

Field.populateDistances();
Shop.populateDistances();

for (let weapon of Weapon.byID) {
  weapon.droppedBy.sort((a, b) => a.distance - b.distance)
}

for (let armor of Armor.byID) {
  armor.droppedBy.sort((a, b) => a.distance - b.distance)
}

for (let shield of Shield.byID) {
  shield.droppedBy.sort((a, b) => a.distance - b.distance)
}

for (let accessory of Accessory.byID) {
  accessory.droppedBy.sort((a, b) => a.distance - b.distance)
}

export interface Set {
  weapon: Weapon.Weapon;
  armor: Armor.Armor;
  shield: Shield.Shield;
  accessory: Accessory.Accessory;
  pet: Monster.Monster;
  skills: Skill.SkillLevel[];
  weight: number,
  stats: Stat.Stats;
  elements: Element.Elements;
}

function makeSet(status: Status.Status): Set {
  return {
    weapon: status.weapon,
    armor: status.armor,
    shield: status.shield,
    accessory: status.accessory,
    pet: status.pet,
    skills: status.skillLevels,
    weight: status.weight,
    stats: status.stats,
    elements: status.elements
  };
}

export class Calculator {
  collection: Collection.Collection;
  filter: SkillFilter.Filter;

  weapons: Weapon.Weapon[] | null;
  armors: Armor.Armor[] | null;
  shields: Shield.Shield[] | null;
  accessories: Accessory.Accessory[] | null;
  pets: Monster.Monster[] | null;

  sets: Set[] | null;
  duration: number;

  constructor(collection: Collection.Collection) {
    this.collection = collection;
    this.filter = new SkillFilter.Filter();
  }

  invalidateSets() {
    this.sets = null;
  }

  invalidateWeapons() {
    this.weapons = null;
    this.invalidateSets();
  }

  invalidateArmors() {
    this.armors = null;
    this.invalidateSets();
  }

  invalidateShields() {
    this.shields = null;
    this.invalidateSets();
  }

  invalidateAccessories() {
    this.accessories = null;
    this.invalidateSets();
  }

  invalidatePets() {
    this.pets = null;
    this.invalidateSets();
  }

  invalidateSkills() {
    this.invalidateWeapons();
    this.invalidateArmors();
    this.invalidateShields();
    this.invalidateAccessories();
    this.invalidatePets();
  }

  getWeapons() {
    if (this.weapons == null) this.weapons = this.filter.filterEquipments(this.collection.weapons).sort((a, b) => a.name.localeCompare(b.name)).concat(Weapon.byID[0]);
    return this.weapons;
  }

  getArmors() {
    if (this.armors == null) this.armors = this.filter.filterEquipments(this.collection.armors).sort((a, b) => a.name.localeCompare(b.name)).concat(Armor.byID[0]);
    return this.armors;
  }

  getShields() {
    if (this.shields == null) this.shields = this.filter.filterEquipments(this.collection.shields).sort((a, b) => a.name.localeCompare(b.name)).concat(Shield.byID[0]);
    return this.shields;
  }

  getAccessories() {
    if (this.accessories == null) this.accessories = this.filter.filterEquipments(this.collection.accessories).sort((a, b) => a.name.localeCompare(b.name)).concat(Accessory.byID[0]);
    return this.accessories;
  }

  getPets() {
    if (this.pets == null) this.pets = this.filter.filterEquipments(this.collection.pets).sort((a, b) => a.name.localeCompare(b.name)).concat(Monster.byID[0]);
    return this.pets;
  }

  countPossibleSets() {
    return this.getWeapons().length *
      this.getArmors().length *
      this.getShields().length *
      this.getAccessories().length *
      this.getPets().length;
  }

  getSets() {
    if (this.sets == null) {
      this.calculateSets();
    }

    return this.sets as Set[];
  }

  calculateSets() {
    this.sets = [];
    const status = new Status.Status();

    const start = new Date();
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
                this.sets.push(makeSet(status));
              }
            }
          }
        }
      }
    }

    this.duration = new Date().valueOf() - start.valueOf();
  }
}
