import { PlayButton } from "/JocPhaser_Elies/components/play-button.js";

export class Menu extends Phaser.Scene {

    constructor() {
        super({ key: 'menu'});
        this.playButton = new PlayButton(this);
    }

    preload() {
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image('background', 'images/background.png');
        this.load.image('logo', 'images/menu-logo.png');
        this.load.image('play-button', 'images/play-button.png');
    }

    create() {
        this.sound.stopAll()
        //CARREGAR FONS/PLATAFORMES
        this.add.image(400, 300, 'background');
        this.logo = this.add.image(400, 200, 'logo');
        this.logo.setScale(0.50);
        this.playButton.create();
        
    }


    update() {
    
    }

}
