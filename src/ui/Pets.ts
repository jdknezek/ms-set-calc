import * as Calculator from "../Calculator";
import * as Monster from "../game/Monster";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

interface State {
  search: string;
}

export const Pets: m.Component<Attrs, State> = {
  view({ attrs: { calculator }, state }) {
    const monsters = Monster.byID
      .slice(1)
      .filter(monster => !state.search || monster.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.pets',
      m('input[placeholder=Search pets]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.pets.length / (Monster.byID.length - 1)).toFixed(1)}%) `,
      m('span.tag', {
        onclick: (_e: any) => {
          if (calculator.collection.pets.length < Monster.byID.length - 1) {
            calculator.collection.pets = Monster.byID.slice(1);
          } else {
            calculator.collection.pets = [];
          }
          calculator.collection.save();
          calculator.invalidatePets();
        },
      }, 'All'),
      m('br'),
      monsters.map(monster => m('span', {
        class: `tag ${calculator.collection.has(monster) ? 'collected' : ''} ${calculator.filter.filterEquipment(monster) ? 'contributing' : ''}`,
        onclick: (_e: any) => {
          if (calculator.collection.has(monster)) calculator.collection.remove(monster)
          else calculator.collection.add(monster);
          calculator.collection.save();
          calculator.invalidatePets();
        }
      },
        monster.name
      ))
    );
  }
}
