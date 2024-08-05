import { Entity } from "../Entity.js";
import { SPRITES } from "../Constants.js";

export class Player extends Entity {
    constructor(scene, x, y, speed) {
        super(scene, x, y, SPRITES.PLAYER);
        
        const anims = this.scene.anims;
        const animsFrameRate = 10;
        this.textureKey = SPRITES.PLAYER;
        this.speed = speed;

        // Проверка и создание анимаций только если их еще нет
        if (!anims.get('left')) {
            anims.create({
                key: 'left',
                frames: anims.generateFrameNumbers(this.textureKey, { start: 25, end: 28 }),
                frameRate: animsFrameRate,
                repeat: -1
            });
        }

        if (!anims.get('right')) {
            anims.create({
                key: 'right',
                frames: anims.generateFrameNumbers(this.textureKey, { start: 9, end: 12 }),
                frameRate: animsFrameRate,
                repeat: -1
            });
        }

        if (!anims.get('up')) {
            anims.create({
                key: 'up',
                frames: anims.generateFrameNumbers(this.textureKey, { start: 17, end: 20 }),
                frameRate: animsFrameRate,
                repeat: -1
            });
        }

        if (!anims.get('down')) {
            anims.create({
                key: 'down',
                frames: anims.generateFrameNumbers(this.textureKey, { start: 0, end: 3 }),
                frameRate: animsFrameRate,
                repeat: -1
            });
        }

        this.inputs = {
            up: false,
            down: false,
            left: false,
            right: false,
        };
    }

    update(time, delta) {
        // Обработка анимаций и движения
        const anims = this.scene.anims;
    
        if (this.inputs.up) {
          this.play('up', true);
          this.y -= this.speed;
        } else if (this.inputs.down) {
          this.play('down', true);
          this.y += this.speed;
        } else if (this.inputs.left) {
          this.play('left', true);
          this.x -= this.speed;
        } else if (this.inputs.right) {
          this.play('right', true);
          this.x += this.speed;
        } else {
          this.stop();
        }
    }

    getInputs() {
        return this.inputs;
    }
}
