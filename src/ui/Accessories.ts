import * as Accessory from "../game/Accessory";
import * as Calculator from "../Calculator";
import * as Popup from "./Popup";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

interface State {
  search: string;
}

export const Accessories: m.Component<Attrs, State> = {
  view({ attrs: { calculator }, state }) {
    const accessories = Accessory.byID
      .slice(1)
      .filter(accessory => !state.search || accessory.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.accessories',
      m('input[placeholder=Search accessories]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.accessories.length / (Accessory.byID.length - 1)).toFixed(1)}%) `,
      m('span.tag', {
        onclick: (_e: any) => {
          if (calculator.collection.accessories.length < Accessory.byID.length - 1) {
            calculator.collection.accessories = Accessory.byID.slice(1);
          } else {
            calculator.collection.accessories = [];
          }
          calculator.collection.save();
          calculator.invalidateAccessories();
        },
      }, 'All'),
      m('br'),
      accessories.map(accessory => m(Popup.Name, {
        data: { equipment: accessory },
        class: `tag ${calculator.collection.has(accessory) ? 'collected' : ''} ${calculator.filter.filterEquipment(accessory) ? 'contributing' : ''}`,
        onclick: (_e: any) => {
          if (calculator.collection.has(accessory)) calculator.collection.remove(accessory)
          else calculator.collection.add(accessory);
          calculator.collection.save();
          calculator.invalidateAccessories();
        }
      }))
    );
  }
}
