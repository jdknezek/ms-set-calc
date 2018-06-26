import m from "mithril";
import * as Armor from "../game/Armor";
import * as Calculator from "../Calculator";

type Attrs = {
  calculator: Calculator.Calculator;
}

type State = {
  search: string;
}

export const Armors: m.Component<Attrs, State> = {
  view({ attrs, state }) {
    const { calculator } = attrs;
    const armors = Armor.byID
      .slice(1)
      .filter(armor => !state.search || armor.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.armors',
      m('input[placeholder=Search armors]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.armors.length / (Armor.byID.length - 1)).toFixed(1)}%)`,
      m('br'),
      armors.map(armor => m('label', {
        class: `tag ${!calculator.collection.has(armor) ? 'missing' : calculator.filter.filterEquipment(armor) ? 'collected' : 'filtered'}`
      }, m('input[type=checkbox]', {
        checked: calculator.collection.has(armor),
        onchange: m.withAttr('checked', checked => {
          if (!!checked) calculator.collection.add(armor);
          else calculator.collection.remove(armor);
          calculator.collection.save();
        })
      }),
        armor.name
      ))
    );
  }
}
