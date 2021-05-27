import { Button } from './button.js';

export class RestartButton extends Button {
  constructor(scene) {
    super(scene, 'try_again', 300, 250);
  }

  doClick() {
    this.relatedScene.scene.start('game');
  }

}