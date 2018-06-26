import m from "mithril";
import * as Shield from "../game/Shield";
import * as Calculator from "../Calculator";

type Attrs = {
  calculator: Calculator.Calculator;
}

type State = {
  search: string;
}

export const Shields: m.Component<Attrs, State> = {
  view({ attrs, state }) {
    const { calculator } = attrs;
    const shields = Shield.byID
      .slice(1)
      .filter(shield => !state.search || shield.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.shields',
      m('input[placeholder=Search shields]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.shields.length / (Shield.byID.length - 1)).toFixed(1)}%)`,
      m('br'),
      shields.map(shield => m('label', {
        class: `tag ${!calculator.collection.has(shield) ? 'missing' : calculator.filter.filterEquipment(shield) ? 'collected' : 'filtered'}`
      }, m('input[type=checkbox]', {
        checked: calculator.collection.has(shield),
        onchange: m.withAttr('checked', checked => {
          if (!!checked) calculator.collection.add(shield);
          else calculator.collection.remove(shield);
          calculator.collection.save();
        })
      }),
        shield.name
      ))
    );
  }
}
