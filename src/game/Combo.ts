import * as Data from "./Data";
import * as Skill from "./Skill";

const combos = Data.parseText(
    require('fs').readFileSync(`${__dirname}/data/combos.csv`, 'utf8')
  ).reduce((combos, record) => {
    combos[+record.wpnAmr] = Skill.byIDs(record.skill1st2nd3rd);
    return combos;
  }, {} as {[index: number]: Skill.Skill[]});

export function getSkills(weaponID: number, armorID: number) {
  return combos[1000000 + weaponID * 1000 + armorID] || [];
}
