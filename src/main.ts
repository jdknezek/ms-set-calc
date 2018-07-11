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

let collection = Collection.load();
collection.save();

let calculator = new Calculator.Calculator(collection);

m.mount(document.body, {
  view() {
    return [
      m(Popup.Popup),
      m(Skills.Skills, { calculator }),
      m('input[type=button][value=Export Collection]', { onclick: exportCollection }),
      m('input[type=button][value=Import Collection]', { onclick: importCollection }),
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

function exportCollection() {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = JSON.stringify(collection.toJSON());
  textarea.select();
  const success = document.execCommand('copy');
  textarea.remove();
  if (success) {
    alert('Collection exported to clipboard.');
  } else {
    alert('Error exporting collection to clipboard.');
  }
}

function importCollection() {
  const json = prompt('Paste export below:');
  if (!json) return;
  try {
    JSON.parse(json);
  } catch (e) {
    alert(`Error parsing export: ${e.message}`);
    return;
  }

  localStorage.setItem('collection', json);
  collection = Collection.load();
  calculator = new Calculator.Calculator(collection);
}
