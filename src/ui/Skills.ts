import * as Calculator from "../Calculator";
import * as Skill from "../game/Skill";
import m from "mithril";

export interface Attrs {
  calculator: Calculator.Calculator;
}

export const Skills: m.Component<Attrs> = {
  view({ attrs: { calculator } }) {
    const skills = Skill.byID.slice().sort((a, b) => a.name.localeCompare(b.name));

    return m('ul', calculator.filter.skillLevels.map((skillLevel, index) => m('li',
      m('select', {
        onchange: m.withAttr('selectedIndex', selectedIndex => {
          const skill = skills[+selectedIndex];
          skillLevel.skill = skill;
          if (skillLevel.level > skill.maxLevel) skillLevel.level = skill.maxLevel;
          calculator.invalidateSkills();
        })
      }, skills.map(option => m('option', {
        selected: option === skillLevel.skill
      }, option.name))
      ),
      m('input[type=number]', {
        min: 1,
        max: skillLevel.skill.maxLevel,
        value: skillLevel.level,
        onchange: m.withAttr('value', value => {
          calculator.filter.skillLevels[index].level = +value;
          calculator.invalidateSets();
        })
      }),
      ` ${skillLevel.skill.toString(skillLevel.level)}`
    )));
  }
}
