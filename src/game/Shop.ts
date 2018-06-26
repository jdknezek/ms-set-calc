import * as Accessory from "./Accessory";
import * as Armor from "./Armor";
import * as Data from "./Data";
import * as Field from "./Field";
import * as Shield from "./Shield";
import * as Weapon from "./Weapon";
const fs = require('fs');

const weaponIDs = Data.parseText(
  fs.readFileSync(`${__dirname}/data/shop-weapons.csv`, 'utf8')
).map(record => +record.weaponId);

const armorIDs = Data.parseText(
  fs.readFileSync(`${__dirname}/data/shop-armors.csv`, 'utf8')
).map(record => +record.armorId);

const shieldIDs = Data.parseText(
  fs.readFileSync(`${__dirname}/data/shop-shields.csv`, 'utf8')
).map(record => +record.shieldId);

const accessoryIDs = Data.parseText(
  fs.readFileSync(`${__dirname}/data/shop-accessories.csv`, 'utf8')
).map(record => +record.accessoryId);

export enum ShopType {
  ZERO,
  WEAPON,
  ARMOR,
  SHIELD,
  ACCESSORY
}

function getShopType(distance: number) {
  distance--;
  if (distance >= 0 && distance % 3 === 0) {
    const num = distance / 3;
    switch (num % 11) {
      case 1: return ShopType.WEAPON;
      case 3: return ShopType.ARMOR;
      case 5: return ShopType.SHIELD;
      case 7: return ShopType.ACCESSORY;
    }
  }
  return ShopType.ZERO;
}

function getLoopNum(distance: number) {
  let num = Math.floor((distance - 1) / 33);
  if (num < 0) num = 0;
  return num;
}

function getWeaponIDs(distance: number) {
  const shopType = getShopType(distance);
  if (shopType !== ShopType.WEAPON) return [];

  const loopNum = getLoopNum(distance);
  const start = loopNum * 4;
  return weaponIDs
    .slice(start, start + 4)
    .filter(id => id !== 0);
}

function getArmorIDs(distance: number) {
  const shopType = getShopType(distance);
  if (shopType !== ShopType.ARMOR) return [];

  const loopNum = getLoopNum(distance);
  const start = loopNum * 4;
  return armorIDs
    .slice(start, start + 4)
    .filter(id => id !== 0);
}

function getShieldIDs(distance: number) {
  const shopType = getShopType(distance);
  if (shopType !== ShopType.SHIELD) return [];

  const loopNum = getLoopNum(distance);
  const start = loopNum * 4;
  return shieldIDs
    .slice(start, start + 4)
    .filter(id => id !== 0);
}

function getAccessoryIDs(distance: number) {
  const shopType = getShopType(distance);
  if (shopType !== ShopType.ACCESSORY) return [];

  const loopNum = getLoopNum(distance);
  const start = loopNum * 4;
  return accessoryIDs
    .slice(start, start + 4)
    .filter(id => id !== 0);
}

export function populateDistances() {
  for (let distance = 0; distance <= Field.byDistance[Field.byDistance.length - 1].distance; distance++) {
    const shopType = getShopType(distance);
    if (shopType === ShopType.ZERO) continue;

    switch (shopType) {
      case ShopType.WEAPON:
        for (let id of getWeaponIDs(distance)) {
          Weapon.byID[id].shopDistance = distance;
        }
        break;
      case ShopType.ARMOR:
        for (let id of getArmorIDs(distance)) {
          Armor.byID[id].shopDistance = distance;
        }
        break;
      case ShopType.SHIELD:
        for (let id of getArmorIDs(distance)) {
          Shield.byID[id].shopDistance = distance;
        }
        break;
      case ShopType.ACCESSORY:
        for (let id of getAccessoryIDs(distance)) {
          Accessory.byID[id].shopDistance = distance;
        }
        break;
    }
  }
}
