import { Button } from './button.js';

export class PlayButton extends Button {
  constructor(scene) {
    super(scene, 'play-button', 400, 370);
  }

  doClick() {
    this.relatedScene.scene.start('game');
  }

}