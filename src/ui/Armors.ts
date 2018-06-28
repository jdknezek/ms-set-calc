import * as Armor from "../game/Armor";
import * as Calculator from "../Calculator";
import * as Popup from "./Popup";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

interface State {
  search: string;
}

export const Armors: m.Component<Attrs, State> = {
  view({ attrs: { calculator }, state }) {
    const armors = Armor.byID
      .slice(1)
      .filter(armor => !state.search || armor.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.armors',
      m('input[placeholder=Search armors]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.armors.length / (Armor.byID.length - 1)).toFixed(1)}%) `,
      m('span.tag', {
        onclick: (_e: any) => {
          if (calculator.collection.armors.length < Armor.byID.length - 1) {
            calculator.collection.armors = Armor.byID.slice(1);
          } else {
            calculator.collection.armors = [];
          }
          calculator.collection.save();
          calculator.invalidateArmors();
        },
      }, 'All'),
      m('br'),
      armors.map(armor => m(Popup.Name, {
        data: { equipment: armor },
        class: `tag ${calculator.collection.has(armor) ? 'collected' : ''} ${calculator.filter.filterEquipment(armor) ? 'contributing' : ''}`,
        onclick: (_e: any) => {
          if (calculator.collection.has(armor)) calculator.collection.remove(armor)
          else calculator.collection.add(armor);
          calculator.collection.save();
          calculator.invalidateArmors();
        },
      }))
    );
  }
}
