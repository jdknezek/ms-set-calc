import * as Calculator from "../Calculator";
import * as Shield from "../game/Shield";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

export interface State {
  search: string;
}

export const Shields: m.Component<Attrs, State> = {
  view({ attrs: { calculator }, state }) {
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
      shields.map(shield => m('span', {
        class: `tag ${calculator.collection.has(shield) ? 'collected' : ''} ${calculator.filter.filterEquipment(shield) ? 'contributing' : ''}`,
        onclick: (_e: any) => {
          if (calculator.collection.has(shield)) calculator.collection.remove(shield)
          else calculator.collection.add(shield);
          calculator.collection.save();
          calculator.invalidateShields();
        }
      },
        shield.name
      ))
    );
  }
}
