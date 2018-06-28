import * as Calculator from "../Calculator";
import * as Element from "../game/Element";
import * as Stat from "../game/Stat";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

enum Direction {
  Ascending,
  Descending
}

interface State {
  sort: { column: Column, direction: Direction }
}

interface Comparer {
  (a: Calculator.Set, b: Calculator.Set): number;
}

interface Column {
  name: string;
  get(set: Calculator.Set): any;
  compare(a: Calculator.Set, b: Calculator.Set): number;
}

function compareNames(get: (set: Calculator.Set) => string): Comparer {
  return (a, b) => {
    const c = get(a);
    const d = get(b);

    return c === '-'
      ? d === '-'
        ? 0
        : 1
      : d === '-'
        ? -1
        : c.localeCompare(d);
  }
}

function nameColumn(name: string, get: (set: Calculator.Set) => string): Column {
  return { name, get: get, compare: compareNames(get) };
}

function skillColumn(index: number): Column {
  const nameComparer = compareNames(set => set.skills[index].skill.name);

  return {
    name: `Skill ${index + 1}`,
    get: set => set.skills[index].skill.toString(set.skills[index].level),
    compare: (a, b) => {
      const cmp = nameComparer(a, b);
      return cmp !== 0 ? cmp : a.skills[index].level - b.skills[index].level;
    }
  };
}

function statColumn(statID: Stat.StatID): Column {
  const get = (set: Calculator.Set) => set.stats[statID]
  return { name: Stat.StatID[statID], get, compare: (a, b) => get(a) - get(b) };
}

function elementColumn(elementID: Element.ElementID): Column {
  const get = (set: Calculator.Set) => set.elements[elementID]
  return { name: Element.ElementID[elementID], get, compare: (a, b) => get(a) - get(b) };

}

const columns: Column[] = [
  nameColumn('Weapon', set => set.weapon.name),
  nameColumn('Armor', set => set.armor.name),
  nameColumn('Shield', set => set.shield.name),
  nameColumn('Accessory', set => set.accessory.name),
  nameColumn('Pet', set => set.pet.name),
  skillColumn(0),
  skillColumn(1),
  skillColumn(2),
  statColumn(Stat.StatID.HP),
  statColumn(Stat.StatID.ATK),
  statColumn(Stat.StatID.DEF),
  statColumn(Stat.StatID.MEN),
  statColumn(Stat.StatID.SPD),
  statColumn(Stat.StatID.LUK),
  { name: 'WGT', get: set => set.weight, compare: (a, b) => a.weight - b.weight },
  elementColumn(Element.ElementID.FIRE),
  elementColumn(Element.ElementID.WATER),
  elementColumn(Element.ElementID.LEAF),
  elementColumn(Element.ElementID.LIGHT),
  elementColumn(Element.ElementID.DARK)
];

function descending(compare: Comparer): Comparer {
  return (a, b) => -compare(a, b);
}

export const Sets: m.Component<Attrs, State> = {
  view({ attrs: { calculator }, state }) {
    const sets = calculator.getSets();

    return m('table',
      m('thead', m('tr', columns.map(column => m('th', {
        onclick: (_e: any) => {
          if (state.sort == null || state.sort.column !== column) {
            state.sort = { column, direction: Direction.Ascending };
          } else if (state.sort.column === column) {
            state.sort.direction = state.sort.direction === Direction.Ascending ? Direction.Descending : Direction.Ascending;
          }
          let { compare } = column;
          if (state.sort.direction === Direction.Descending) {
            compare = descending(compare);
          }
          sets.sort(compare);
        },
      }, column.name)))),
      m('tbody', sets.map(set => m('tr', columns.map(column => m('td', column.get(set))))))
    );
  }
}
