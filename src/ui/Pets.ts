import m from "mithril";
import * as Monster from "../game/Monster";
import * as Calculator from "../Calculator";

type Attrs = {
  calculator: Calculator.Calculator;
}

type State = {
  search: string;
}

export const Pets: m.Component<Attrs, State> = {
  view({ attrs, state }) {
    const { calculator } = attrs;
    const monsters = Monster.byID
      .slice(1)
      .filter(monster => !state.search || monster.name.indexOf(state.search.toUpperCase()) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name));

    return m('div.pets',
      m('input[placeholder=Search pets]', {
        value: state.search,
        oninput: m.withAttr('value', value => state.search = value)
      }),
      ` (${(100 * calculator.collection.pets.length / (Monster.byID.length - 1)).toFixed(1)}%)`,
      m('br'),
      monsters.map(monster => m('label', {
        class: `tag ${!calculator.collection.has(monster) ? 'missing' : calculator.filter.filterEquipment(monster) ? 'collected' : 'filtered'}`
      }, m('input[type=checkbox]', {
        checked: calculator.collection.has(monster),
        onchange: m.withAttr('checked', checked => {
          if (!!checked) calculator.collection.add(monster);
          else calculator.collection.remove(monster);
          calculator.collection.save();
        })
      }),
        monster.name
      ))
    );
  }
}
