import * as Element from "../game/Element";
import * as Monster from "../game/Monster";
import * as Skill from "../game/Skill";
import * as Stat from "../game/Stat";
import m from "mithril";
import Popper from "popper.js";

export interface Equipment {
  id: number;
  toString(): string;
  stats: Stat.Stats;
  elements: Element.Elements;
  skills: Skill.Skill[];
  shopDistance?: number;
  droppedBy?: Monster.Monster[];
  distance?: number;
  rarity?: number;
}

interface State {
  equipment: Equipment;
}

let vnode: m.VnodeDOM<{}, State>;
let popper: Popper;

export const Popup: m.Component<{}, State> = {
  oncreate(vnode_) {
    vnode = vnode_;
  },

  view({state: {equipment}}) {
    return m('div.popup', equipment && equipment.id !== 0 && [
      m('div.popup-title', equipment.toString()),
      m('div.popup-body',
        Object.keys(equipment.stats).length > 0 && m('table.stats',
          m('thead', m('tr',
            m('th', 'Stat'),
            m('th', '/ Level'),
          )),
          m('tbody', Object.keys(equipment.stats).map((statID: any) => m('tr',
            m('td', Stat.StatID[statID]),
            m('td.numeric', equipment.stats[statID].toFixed(1)),
          ))),
        ),
        Object.keys(equipment.elements).length > 0 && m('table.elements',
          m('thead', m('tr',
            m('th', 'Element'),
            m('th', '%'),
          )),
          m('tbody', Object.keys(equipment.elements).map((elementID: any) => m('tr',
            m('td', Element.ElementID[elementID]),
            m('td.numeric', equipment.elements[elementID]),
          )))
        ),
        m('table.skills',
          m('thead', m('tr', m('th', 'Skills'))),
          m('tbody', equipment.skills.map(skill => m('tr', m('td', skill.name))))
        ),
        equipment instanceof Monster.Monster ? [
          equipment.distance && m('div', m('b', 'Distance: '), equipment.distance),
          m('div', m('b', 'Spawn Rate: '), equipment.spawnRate)
        ] : [
          equipment.shopDistance && m('div', m('b', 'Shop: '), equipment.shopDistance),
          equipment.droppedBy && equipment.droppedBy.length && m('table',
            m('thead', m('tr',
              m('th', 'Monster'),
              m('th', 'Distance'),
              m('th', 'Spawn Rate'),
            )),
            m('tbody', equipment.droppedBy.map(monster => m('tr',
              m('td', monster.toString()),
              m('td.numeric', monster.distance || ''),
              m('td.numeric', monster.spawnRate)
            )))
          )
        ]
      )
    ]);
  }
}

export interface Attrs extends m.Attributes {
  data: {equipment: Equipment};
}

export const Name: m.Component<Attrs> = {
  view(vnode) {
    const {equipment} = vnode.attrs.data;

    return m("span", {
      onmouseover: equipment.id === 0 ? null : (e: any) => show(e.target, equipment),
      onmouseout: equipment.id === 0 ? null : (_e: Element) => hide(),
      ...vnode.attrs
    }, equipment.toString())
  }
}

export function show(reference: Element, equipment: Equipment) {
  vnode.state.equipment = equipment;
  popper = new Popper(reference, vnode.dom, {placement: 'auto'});
  vnode.dom.style.visibility = 'visible';
}

export function hide() {
  vnode.dom.style.visibility = 'hidden';
  popper.destroy();
}
