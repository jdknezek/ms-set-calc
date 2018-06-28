import * as Monster from "../game/Monster";
import m from "mithril";
import Popper from "popper.js";

export interface Equipment {
  id: number;
  toString(): string;
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
      equipment instanceof Monster.Monster ? [
        equipment.distance && m('div', `Distance: ${equipment.distance}`),
        m('div', `Rarity: ${equipment.rarity}`)
      ] : [
        equipment.shopDistance && m('div', `Shop: ${equipment.shopDistance}`),
        equipment.droppedBy && equipment.droppedBy.length && m('table',
          m('thead', m('tr',
            m('th', 'Monster'),
            m('th', 'Distance'),
            m('th', 'Rarity'),
          )),
          m('tbody', equipment.droppedBy.map(monster => m('tr',
            m('td', monster.toString()),
            m('td.numeric', monster.distance || ''),
            m('td.numeric', monster.rarity)
          )))
        )
      ]
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
