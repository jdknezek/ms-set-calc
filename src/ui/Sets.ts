import * as Calculator from "../Calculator";
import * as Element from "../game/Element";
import * as Popup from "./Popup";
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
  sort: { column: Column, direction: Direction };
  page: number;
}

interface Comparer {
  (a: Calculator.Set, b: Calculator.Set): number;
}

interface Column {
  name: string;
  td(set: Calculator.Set): m.Vnode;
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

function equipmentColumn(name: string, get: (set: Calculator.Set) => Popup.Equipment): Column {
  return {
    name,
    td: set => m('td', m(Popup.Name, { data: { equipment: get(set) } })),
    compare: compareNames(set => get(set).toString())
  }
}

function skillColumn(index: number): Column {
  const compare = compareNames(set => set.skills[index].skill.name);

  return {
    name: `Skill ${index + 1}`,
    td: set => m('td.numeric', set.skills[index].skill.toString(set.skills[index].level)),
    compare: (a, b) => {
      const cmp = compare(a, b);
      return cmp !== 0 ? cmp : a.skills[index].level - b.skills[index].level;
    }
  };
}

function statColumn(statID: Stat.StatID): Column {
  const get = (set: Calculator.Set) => set.stats[statID]

  return {
    name: Stat.StatID[statID],
    td: set => m('td.numeric', get(set).toFixed(1)),
    compare: (a, b) => get(a) - get(b)
  };
}

function elementColumn(elementID: Element.ElementID): Column {
  const get = (set: Calculator.Set) => set.elements[elementID]

  return {
    name: Element.ElementID[elementID],
    td: set => m('td.numeric', get(set)),
    compare: (a, b) => get(a) - get(b)
  };
}

const columns: Column[] = [
  equipmentColumn('Weapon', set => set.weapon),
  equipmentColumn('Armor', set => set.armor),
  equipmentColumn('Shield', set => set.shield),
  equipmentColumn('Accessory', set => set.accessory),
  equipmentColumn('Pet', set => set.pet),
  skillColumn(0),
  skillColumn(1),
  skillColumn(2),
  statColumn(Stat.StatID.HP),
  statColumn(Stat.StatID.ATK),
  statColumn(Stat.StatID.DEF),
  statColumn(Stat.StatID.MEN),
  statColumn(Stat.StatID.SPD),
  statColumn(Stat.StatID.LUK),
  { name: 'WGT', td: set => m('td.numeric', set.weight), compare: (a, b) => a.weight - b.weight },
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

    const start = (state.page || 0) * 100;
    const end = Math.min(start + 100, sets.length);
    const rows: m.Vnode[] = [];

    for (let i = start; i < end; i++) {
      const set = sets[i];
      rows.push(m('tr', columns.map(column => column.td(set))));
    }

    return m('div.sets',
      pagination(),
      m('table',
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
        m('tbody', rows)
      ),
      pagination()
    );

    function pagination() {
      const pageCount = Math.ceil(sets.length / 100);
      const pages: m.Vnode[] = [];

      for (let i = 0; i < pageCount; i++) {
        const page = i;
        pages.push(m(`option${state.page === i ? '[selected]' : ''}`, i + 1))
      }

      return m('div.pagination',
        'Page: ',
        m('select', {
          onchange: m.withAttr('selectedIndex', (selectedIndex: number) => state.page = selectedIndex)
        }, pages)
      );
    }
  }
}
