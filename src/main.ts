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
      m(Skills.Skills, { calculator }),
      m(Weapons.Weapons, { calculator }),
      m(Armors.Armors, { calculator }),
      m(Shields.Shields, { calculator }),
      m(Accessories.Accessories, { calculator }),
      m(Pets.Pets, { calculator }),
      calculator.sets == null ? m('input[type=button]', {
        value: `Generate ${calculator.countPossibleSets()} sets`,
        onclick: (_e: any) => calculator.calculateSets()
      }) : [
          `Found ${calculator.sets.length}/${calculator.countPossibleSets()} sets in ${calculator.duration}ms`,
          m(Sets.Sets, { calculator }),
        ],
      m(Popup.Popup)
    ];
  }
});
