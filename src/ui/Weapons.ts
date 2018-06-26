import m from "mithril";
import * as Weapon from "../game/Weapon";
import * as Calculator from "../Calculator";

type Attrs = {
  calculator: Calculator.Calculator;
}

type State = {
  search: string;
}

export const Weapons: m.Component<Attrs, State> = {
  view({ attrs, state }) {
    const { calculator } = attrs;
    const weapons = Weapon.byID
      .slice(1)
      .filter(weapon => !state.search || weapon.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.weapons',
      m('input[placeholder=Search weapons]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.weapons.length / (Weapon.byID.length - 1)).toFixed(1)}%)`,
      m('br'),
      weapons.map(weapon => m('label', {
        class: `tag ${!calculator.collection.has(weapon) ? 'missing' : calculator.filter.filterEquipment(weapon) ? 'collected' : 'filtered'}`
      }, m('input[type=checkbox]', {
        checked: calculator.collection.has(weapon),
        onchange: m.withAttr('checked', checked => {
          if (!!checked) calculator.collection.add(weapon);
          else calculator.collection.remove(weapon);
          calculator.collection.save();
        })
      }),
        weapon.name
      ))
    );
  }
}
