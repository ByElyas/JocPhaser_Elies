import { RestartButton } from "../components/restart-button.js";
import { MenuButton } from "../components/menu-button.js";

export class Game2 extends Phaser.Scene {

    constructor() {
        super({ key: 'game2'});
        this.restartButton = new RestartButton(this);
        this.menuButton = new MenuButton(this);
    }

    init(data) {
        this.lives = data.lives;
        this.score = data.score;
    }

    preload() {
          
        this.load.image('background', 'images/background.png');
        this.load.image('gameover', 'images/gameover.png');
        this.load.image('ground', 'images/platform.png');
        this.load.image('platform1', 'images/platform2.png');
        this.load.image('platform3-l', 'images/platform3-l.png');
        this.load.image('platform3-r', 'images/platform3-r.png');
        this.load.image('coin', 'images/coin.png');
        this.load.image('lava', 'images/lava.png');
        this.load.audio('coin-sound', 'audio/coin.mp3');
        this.load.image('jump-boost', 'images/jump-boost.png');
        this.load.image('trophy', 'images/trophy.png');
        this.load.image('win', 'images/win.png');
        this.load.image('heart', 'images/full-heart.png');
        this.load.audio('win-sound', 'audio/win-sound.mp3');
        
        this.load.spritesheet('dude', 
            'sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('try_again', 'images/try_again.png');
        this.load.image('menu-button', 'images/menu-button.png');
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
         this.sound.stopAll()
         //CARREGAR FONS/PLATAFORMES
         this.add.image(400, 300, 'background');


         this.jumpSpeed = -330;
         //CARREGAR PLATAFORMES
         this.platforms = this.physics.add.staticGroup();
         this.enemies = this.physics.add.staticGroup();
         //this.boost = this.physics.add.staticGroup();
         this.boost = this.physics.add.group({
            key: 'jump-boost',
            repeat: 1,
            setXY: { x: 570, y: 480}
        });

        this.trophy = this.physics.add.group({
            key: 'trophy',
            repeat: 1,
            setXY: {x: 750, y: 20}
        });
         
         //LAVA <- Abans de les plataformes, que si no sobre-surt i queda feo
         this.enemies.create(700, 600, 'lava').setScale(1).refreshBody()
         this.enemies.create(300, 600, 'lava').setScale(1).refreshBody()


 
 
         //PLATAFORMES 
         this.platforms.create(-50, 700, 'ground').setScale(1).refreshBody()

         this.platforms.create(25, 250, 'platform3-r').setScale(0.5).refreshBody()

         this.platforms.create(290, 580, 'platform1').setScale(0.5).refreshBody()
         this.platforms.create(290, 200, 'platform1').setScale(0.5).refreshBody()
         this.platforms.create(600, 650, 'ground').setScale(0.75).refreshBody()
 
         this.platforms.create(580, 400, 'platform3-l').setScale(0.75).refreshBody()
         this.platforms.create(620, 200, 'platform3-r').setScale(0.50).refreshBody()
         this.platforms.create(900, 400, 'ground').setScale(1.5).refreshBody()
 
         
         //HUD aqui perque te que sobreposar-se a les plataformes
         //Menu de morir     
         
        
 
         this.gameoverImage = this.add.image(400, 90, 'gameover');
         this.gameoverImage.setScale(0.20);
         this.gameoverImage.visible = false;

         this.winImage = this.add.image(400, 90, 'win');
         this.winImage.visible = false;
 
         //normal HUD
         this.scoreText = this.add.text(16, 16, 'Score: '+ this.score, { fontSize: '32px', fill: '#000' }); 
         if (this.score < 0) {
            this.scoreText.setColor('#ff0000', 32);
        } else {
            this.scoreText.setColor('#000000', 32);
        }   

        this.hearts=[];
        this.heartsx = 630;
        this.heartsy = 30; 
        for (var i=1; i <= this.lives; i++) {     
            this.hearts[i] = this.add.image(this.heartsx, this.heartsy, 'heart');
            this.hearts[i].setScale(0.20);
            this.heartsx+=50;
        }; 
 
         
         //Crear personatje
         this.player = this.physics.add.sprite(100, 350, 'dude');
         this.player.setBounce(0.2);
         this.player.setCollideWorldBounds(true);
 
         //Crear sonidos
         this.coin_sound = this.sound.add('coin-sound');
         this.coin_sound 
 
         this.anims.create({
             key: 'left',
             frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
             frameRate: 10,
             repeat: -1
         });
         
         this.anims.create({
             key: 'turn',
             frames: [ { key: 'dude', frame: 4 } ],
             frameRate: 20
         });
         
         this.anims.create({
             key: 'right',
             frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
             frameRate: 10,
             repeat: -1
         });
 
 
         //Crear status viu/mort i victoria
         this.alive = true;
         this.win = false;
 
         
        


         //MONEDES
         this.coins = this.physics.add.group({
             key: 'coin',
             repeat: 3,
             setXY: { x: 12, y: 0, stepX: 90 }
         });

        //EFECTES AL RECOLLIR LES MONEDES
        this.particles = this.add.particles('coin');
        this.emitter;


         this.coins.children.iterate(function (child) {
         
             child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
         
         });
 
 
         function collectCoin (player, coin)
         {
             coin.disableBody(true, true);
 
             this.score += 10;
             this.scoreText.setText('Score: ' + this.score);
             if (this.score >= 0) {
                 this.scoreText.setColor('#000000', 32);
             }
             this.emitter = this.particles.createEmitter({
                x: coin.x,
                y: coin.y,
                lifespan: 800,
                speed: 500,
                scale: { start: 0.9, end: 0 },
                gravityY: 800
            });
            this.coin_sound.play({volume: 0.2});
            this.time.delayedCall(20,deactivateCoinEffect,[this.emitter],this); 
             
         }
         function deactivateCoinEffect(emitter) {
            emitter.on = false;
        }
 
         //Pillar damage, sigue de entorn o enemics.
         function takeDamage ()
         {
             //CODI DE MORIR
             //baixar una vida
             this.hearts[this.lives].destroy();
             this.lives += -1;
             if (this.lives == 0)
             {
                 this.alive = false;
                 this.death_music = this.sound.add('death-music');
                 this.death_music.play({volume: 0.2});
             } else {
                 //Reseteija el personatje al mateix punt de inici
                 //Lo poso aqui perque no vull que es reseteji quan morigue, si no que es quedi quemant
                 //eternament al pozo de lava :D
                 this.player.setPosition(100, 350);
 
                 this.damage_sound = this.sound.add('damage-sound');
                 this.damage_sound.play({volume: 0.2});
             }
             
 
             //Treure punts del score cada vegada que es caigui a la lava
             this.score += -30;
             if (this.score < 0) {
                 this.scoreText.setColor('#ff0000', 32);
             } else {
                 this.scoreText.setColor('#000000', 32);
             }
             this.scoreText.setText('Score: ' + this.score);
         }

         function takeBoost(player, boost)
         {
            this.jumpSpeed = -400;
            boost.disableBody(true,true);
         }

         function win()
         {
            this.win_sound = this.sound.add('win-sound');
            this.win_sound.play({volume: 0.4});
            this.win = true;
         }

         function dissapearCoin(player, coin)
         {
            coin.disableBody(true, true);
         }
 
 
 
 
         
         //COLISIONS
         this.physics.add.collider(this.player, this.platforms);
         this.physics.add.collider(this.coins, this.platforms);
         this.physics.add.collider(this.boost, this.platforms);
         this.physics.add.collider(this.trophy, this.platforms);
 
         //Detecció de pilalr moneda
         this.physics.add.overlap(this.player, this.coins, collectCoin, null, this);
 
         //Detecció de tocar enemics
         this.physics.add.overlap(this.player, this.enemies, takeDamage, null, this);

         this.physics.add.overlap(this.player, this.boost, takeBoost, null, this);
         this.physics.add.overlap(this.player, this.trophy, win, null, this);
         this.physics.add.overlap(this.enemies, this.coins, dissapearCoin, null, this);
        
    }


    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(this.jumpSpeed);
        }

        if (this.alive == false)
        {
            this.physics.pause();
            this.cameras.main.shake(20);
            this.gameoverImage.visible = true;
            this.player.setTint(0xff0000);
            this.player.anims.play('turn');
            this.restartButton.create();
            this.menuButton.create();
        }

        if (this.win == true)
        {
            this.physics.pause();
            this.winImage.visible = true;
            this.player.setTint(0xf2e675);
            this.player.anims.play('turn');
            this.restartButton.create();
            this.menuButton.create();
        }
    }
    

}