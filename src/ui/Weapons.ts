import * as Calculator from "../Calculator";
import * as Weapon from "../game/Weapon";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

export interface State {
  search: string;
}

export const Weapons: m.Component<Attrs, State> = {
  view({ attrs: { calculator }, state }) {
    const weapons = Weapon.byID
      .slice(1)
      .filter(weapon => !state.search || weapon.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.weapons',
      m('input[placeholder=Search weapons]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.weapons.length / (Weapon.byID.length - 1)).toFixed(1)}%) `,
      m('span.tag', {
        onclick: (_e: any) => {
          if (calculator.collection.weapons.length < Weapon.byID.length - 1) {
            calculator.collection.weapons = Weapon.byID.slice(1);
          } else {
            calculator.collection.weapons = [];
          }
          calculator.invalidateWeapons();
        },
      }, 'All'),
      m('br'),
      weapons.map(weapon => m('span', {
        class: `tag ${calculator.collection.has(weapon) ? 'collected' : ''} ${calculator.filter.filterEquipment(weapon) ? 'contributing' : ''}`,
        onclick: (_e: any) => {
          if (calculator.collection.has(weapon)) calculator.collection.remove(weapon)
          else calculator.collection.add(weapon);
          calculator.collection.save();
          calculator.invalidateWeapons();
        }
      },
        weapon.name
      ))
    );
  }
}
