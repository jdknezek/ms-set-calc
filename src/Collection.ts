import * as Accessory from "./game/Accessory";
import * as Armor from "./game/Armor";
import * as Monster from "./game/Monster";
import * as Shield from "./game/Shield";
import * as Weapon from "./game/Weapon";

console.log(Weapon);

interface Equipment {
  id: number;
}

type Save = {
  weaponIDs: number[];
  armorIDs: number[];
  shieldIDs: number[];
  accessoryIDs: number[];
  petIDs: number[];
}

function findIndex(equipment: Equipment, equipments: Equipment[]) {
  let lo = 0;
  let hi = equipments.length;

  while (lo < hi) {
    const mid = lo + ((hi - lo) >>> 1);
    const midValue = equipments[mid];
    if (midValue.id < equipment.id) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

export class Collection {
  weapons: Weapon.Weapon[];
  armors: Armor.Armor[];
  shields: Shield.Shield[];
  accessories: Accessory.Accessory[];
  pets: Monster.Monster[];

  constructor() {
    this.weapons = [];
    this.armors = [];
    this.shields = [];
    this.accessories = [];
    this.pets = [];
  }

  getEquipments(equipment: Equipment): Equipment[] {
    if (equipment instanceof Weapon.Weapon) return this.weapons;
    else if (equipment instanceof Armor.Armor) return this.armors;
    else if (equipment instanceof Shield.Shield) return this.shields;
    else if (equipment instanceof Accessory.Accessory) return this.accessories;
    else if (equipment instanceof Monster.Monster) return this.pets;
    else return [];
  }

  has(equipment: Equipment) {
    const equipments = this.getEquipments(equipment);
    const index = findIndex(equipment, equipments);
    return index < equipments.length && equipments[index] === equipment;
  }

  add(equipment: Equipment) {
    const equipments = this.getEquipments(equipment);
    const index = findIndex(equipment, equipments);
    if (index === equipments.length) equipments.push(equipment);
    else if (equipments[index] !== equipment) equipments.splice(index, 0, equipment);
  }

  remove(equipment: Equipment) {
    const equipments = this.getEquipments(equipment);
    const index = findIndex(equipment, equipments);
    if (index < equipments.length && equipments[index] === equipment) equipments.splice(index, 1);
  }

  toJSON(): Save {
    return {
      weaponIDs: this.weapons.map(equipment => equipment.id),
      armorIDs: this.armors.map(equipment => equipment.id),
      shieldIDs: this.shields.map(equipment => equipment.id),
      accessoryIDs: this.accessories.map(equipment => equipment.id),
      petIDs: this.pets.map(equipment => equipment.id)
    };
  }

  save() {
    localStorage.setItem('collection', JSON.stringify(this));
  }
}

export function load() {
  const collection = new Collection();

  const json = localStorage.getItem('collection');
  if (json === null) return collection;

  const save: Save = JSON.parse(json);

  collection.weapons = save.weaponIDs.map(id => Weapon.byID[id]);
  collection.armors = save.armorIDs.map(id => Armor.byID[id]);
  collection.shields = save.shieldIDs.map(id => Shield.byID[id]);
  collection.accessories = save.accessoryIDs.map(id => Accessory.byID[id]);
  collection.pets = save.petIDs.map(id => Monster.byID[id]);

  return collection;
}
