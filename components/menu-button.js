import { Button } from './button.js';

export class MenuButton extends Button {
  constructor(scene) {
    super(scene, 'menu-button', 550, 250);
  }

  doClick() {
    this.relatedScene.scene.start('menu');
  }

}