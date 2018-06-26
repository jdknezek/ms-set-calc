import m from "mithril";
import * as Accessory from "../game/Accessory";
import * as Calculator from "../Calculator";

type Attrs = {
  calculator: Calculator.Calculator;
}

type State = {
  search: string;
}

export const Accessories: m.Component<Attrs, State> = {
  view({ attrs, state }) {
    const { calculator } = attrs;
    const accessories = Accessory.byID
      .slice(1)
      .filter(accessory => !state.search || accessory.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.accessories',
      m('input[placeholder=Search accessories]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.accessories.length / (Accessory.byID.length - 1)).toFixed(1)}%)`,
      m('br'),
      accessories.map(accessory => m('label', {
        class: `tag ${!calculator.collection.has(accessory) ? 'missing' : calculator.filter.filterEquipment(accessory) ? 'collected' : 'filtered'}`
      }, m('input[type=checkbox]', {
        checked: calculator.collection.has(accessory),
        onchange: m.withAttr('checked', checked => {
          if (!!checked) calculator.collection.add(accessory);
          else calculator.collection.remove(accessory);
          calculator.collection.save();
        })
      }),
        accessory.name
      ))
    );
  }
}
