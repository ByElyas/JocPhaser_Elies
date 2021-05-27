import { Game } from './game.js';
import { Menu } from './menu.js';
import { Game2 } from './game2.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Menu,Game,Game2],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);
//game.state.add('main', mainState);  
//game.state.start('main');