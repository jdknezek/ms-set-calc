import * as Accessories from "./ui/Accessories";
import * as Armors from "./ui/Armors";
import * as Calculator from "./Calculator";
import * as Collection from "./Collection";
import * as Iter from "./Iter";
import * as Pets from "./ui/Pets";
import * as Shields from "./ui/Shields";
import * as Skills from "./ui/Skills";
import * as Weapons from "./ui/Weapons";
import m from 'mithril';

const collection = Collection.load();
collection.save();

const calculator = new Calculator.Calculator(collection);

console.log(calculator);

m.mount(document.body, {
  view() {
    return [
      m(Skills.Skills, { calculator }),
      `Possible sets: ${calculator.countPossibleSets()}`,
      m(Weapons.Weapons, { calculator }),
      m(Armors.Armors, { calculator }),
      m(Shields.Shields, { calculator }),
      m(Accessories.Accessories, { calculator }),
      m(Pets.Pets, { calculator }),
      m('table',
        m('thead',
          m('tr',
            m('th', 'Weapon'),
            m('th', 'Armor'),
            m('th', 'Shield'),
            m('th', 'Accessory'),
            m('th', 'Pet'),
            m('th', 'Skill 1'),
            m('th', 'Skill 2'),
            m('th', 'Skill 3')
          )
        ),
        m('tbody',
          Array.from(
            Iter.map(set => m('tr',
              m('td', set.weapon.name),
              m('td', set.armor.name),
              m('td', set.shield.name),
              m('td', set.accessory.name),
              m('td', set.pet.name),
              m('td', set.skills[0].skill.toString(set.skills[0].level)),
              m('td', set.skills[1].skill.toString(set.skills[1].level)),
              m('td', set.skills[2].skill.toString(set.skills[2].level))
            ), calculator.calculateSets())
          )
        )
      ),

    ];
  }
});
