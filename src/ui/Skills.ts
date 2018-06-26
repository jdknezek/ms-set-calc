import * as Calculator from "../Calculator";
import * as Skill from "../game/Skill";
import * as SkillFilter from "../SkillFilter";
import m from "mithril";


type Attrs = {
  calculator: Calculator.Calculator;
}

export const Skills: m.Component<Attrs> = {
  view({ attrs }) {
    const { calculator } = attrs;
    const skills = Skill.byID.slice().sort((a, b) => a.name.localeCompare(b.name));

    return m('ul', calculator.filter.skills.map(({ skill, level }, index) => m('li',
      m('select', {
        onchange: m.withAttr('selectedIndex', selectedIndex => {
          calculator.filter.skills[index].skill = skills[+selectedIndex];

        })
      }, skills.map(option => m(`option[value=${skill.id}]`, {
        selected: option === skill
      }, option.name))
      ),
      m('input[type=number]', {
        min: 1,
        max: skill.maxLevel,
        value: level,
        onchange: m.withAttr('value', value => {
          calculator.filter.skills[index].level = +value;
        })
      }),
      ` ${skill.toString(level)}`
    )));
  }
}
