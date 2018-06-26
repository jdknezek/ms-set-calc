import * as Calculator from "../Calculator";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

export const Sets: m.Component<Attrs> = {
  view({ attrs: { calculator } }) {
    return m('table',
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
        calculator.sets == null ? null : calculator.sets.map(set => m('tr',
          m('td', set.weapon.name),
          m('td', set.armor.name),
          m('td', set.shield.name),
          m('td', set.accessory.name),
          m('td', set.pet.name),
          m('td', set.skills[0].skill.toString(set.skills[0].level)),
          m('td', set.skills[1].skill.toString(set.skills[1].level)),
          m('td', set.skills[2].skill.toString(set.skills[2].level))
        ))
      )
    );
  }
}
