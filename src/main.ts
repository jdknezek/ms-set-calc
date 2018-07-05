import * as Accessories from "./ui/Accessories";
import * as Armors from "./ui/Armors";
import * as Calculator from "./Calculator";
import * as Collection from "./Collection";
import * as Pets from "./ui/Pets";
import * as Popup from "./ui/Popup";
import * as Sets from "./ui/Sets";
import * as Shields from "./ui/Shields";
import * as Skills from "./ui/Skills";
import * as Weapons from "./ui/Weapons";
import m from "mithril";

const collection = Collection.load();
collection.save();

const calculator = new Calculator.Calculator(collection);

m.mount(document.body, {
  view() {
    return [
      m(Popup.Popup),
      m(Skills.Skills, { calculator }),
      m(Weapons.Weapons, { calculator }),
      m(Armors.Armors, { calculator }),
      m(Shields.Shields, { calculator }),
      m(Accessories.Accessories, { calculator }),
      m(Pets.Pets, { calculator }),
      m('div', m('input[type=button]', {
        value: calculator.timeout == null ? `Generate ${calculator.countPossibleSets()} possible set${calculator.countPossibleSets() === 1 ? '' : 's'}` : 'Stop generation',
        onclick: (_e: any) => calculator.timeout == null ? calculator.startCalculation() : calculator.stopCalculation()
      })),
      calculator.sets != null && [
        calculator.timeout == null
          ? `Found ${calculator.sets.length} set${calculator.sets.length === 1 ? '' : 's'} in ${calculator.duration} ms`
          : `Generating sets: ${(100 * calculator.tried / calculator.countPossibleSets()).toFixed(1)}%`,
        m(Sets.Sets, { calculator })
      ]
    ];
  }
});
