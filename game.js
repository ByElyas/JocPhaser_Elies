import { RestartButton } from "/JocPhaser_Elies/components/restart-button.js";
import { MenuButton } from "/JocPhaser_Elies/components/menu-button.js";

export class Game extends Phaser.Scene {

    constructor() {
        super({ key: 'game'});
        this.restartButton = new RestartButton(this);
        this.menuButton = new MenuButton(this);
        
    }

    preload() {     
        
        this.load.image('background', 'images/background.png');
        this.load.image('gameover', 'images/gameover.png');
        this.load.image('ground', 'images/platform.png');
        this.load.image('platform1', 'images/platform2.png');
        this.load.image('coin', 'images/coin.png');
        this.load.image('lava', 'images/lava.png');
        this.load.image('next-level-sign', 'images/next-level-sign.png');
        this.load.image('enemy', 'images/enemy.png');
        this.load.image('heart', 'images/full-heart.png');
        this.load.audio('coin-sound', 'audio/coin.mp3');
        this.load.audio('damage-sound', 'audio/damage-sound.mp3');
        this.load.audio('death-music', 'audio/death-music.mp3');
        
        this.load.spritesheet('dude', 
            'sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('try_again', 'images/try_again.png');
        this.load.image('menu-button', 'images/menu-button.png');
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        //this.sound.stopAll()
        //CARREGAR FONS/PLATAFORMES
        this.add.image(400, 300, 'background');

        //Crear status viu/mort i videes
        this.alive = true;
        this.lives = 3;

        //CARREGAR PLATAFORMES
        this.platforms = this.physics.add.staticGroup();
        this.enemies = this.physics.add.staticGroup();
        this.tp = this.physics.add.staticGroup();
        
        //LAVA <- Abans de les plataformes, que si no sobre-surt i queda feo
        this.enemies.create(700, 600, 'lava').setScale(1).refreshBody()
        this.enemies.create(300, 450, 'enemy').setScale(0.75).refreshBody()

        //Signe per a anar al seguent nivell. Abans de les plataformes per a poder amagar lo palo
        //una mica
        this.tp.create(770,460, 'next-level-sign').setScale(0.10).refreshBody();

        //PLATAFORMES
        
        this.platforms.create(300, 668, 'ground').setScale(1).refreshBody()
        this.platforms.create(60, 668, 'ground').setScale(1).refreshBody()
        this.platforms.create(900, 668, 'ground').setScale(1).refreshBody()

        this.platforms.create(100, 230, 'platform1').setScale(0.5).refreshBody()
        this.platforms.create(250, 380, 'platform1').setScale(0.5).refreshBody()
        this.platforms.create(312, 360, 'platform1').setScale(0.5).refreshBody()

        this.platforms.create(50, 230, 'platform1').setScale(0.5).refreshBody()
        this.platforms.create(0, 230, 'platform1').setScale(0.5).refreshBody()

        //HUD aqui perque te que sobreposar-se a les plataformes
        //Menu de morir     
        




        this.gameoverImage = this.add.image(400, 90, 'gameover');
        this.gameoverImage.setScale(0.20);
        this.gameoverImage.visible = false;

        //normal HUD
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });  
        
        
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
        

        
        //this.damage_sound = this.sound.add('damage_sound');
        //this.damage_sound

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


        

        
        //MONEDES
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 4,
            setXY: { x: 12, y: 0, stepX: 90 }
        });

                 
        //EFECTES AL RECOLLIR LES MONEDES
        this.particles = this.add.particles('coin');
        this.emitter;
         
        this.coins.children.iterate(function (child) {
        
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });

        this.score = 0;


        function collectCoin (player, coin)
        {
            coin.disableBody(true, true);
            this.coin_sound = this.sound.add('coin-sound');
            
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

        function gotoNextLevel ()
        {
            this.scene.start('game2', {lives: this.lives, score: this.score});
        }



        
        //COLISIONS
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);

        //Detecció de pilalr moneda
        this.physics.add.overlap(this.player, this.coins, collectCoin, null, this);

        //Detecció de tocar enemics
        this.physics.add.overlap(this.player, this.enemies, takeDamage, null, this);

        //Passar al seguent nivell
        this.physics.add.overlap(this.player, this.tp, gotoNextLevel, null, this);

        
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
            this.player.setVelocityY(-330);
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

    }

}
