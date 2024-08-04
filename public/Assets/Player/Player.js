import { Entity } from "../Entity.js";
import { SPRITES } from "../Constants.js";

export class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, SPRITES.PLAYER);
        this.speed = 50; // Скорость в пикселях в секунду

        const anims = this.scene.anims;
        const animsFrameRate = 10;
        this.textureKey = SPRITES.PLAYER;

        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 25, end: 28
            }),
            frameRate: animsFrameRate,
            repeat: -1
        });

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 9,
                end: 12
            }),
            frameRate: animsFrameRate,
            repeat: -1
        });

        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 17,
                end: 20
            }),
            frameRate: animsFrameRate,
            repeat: -1
        });

        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 3
            }),
            frameRate: animsFrameRate,
            repeat: -1
        });

        this.inputs = {
            up: false,
            down: false,
            left: false,
            right: false,
        };
    }

    update(delta) {
        const cursors = this.scene.input.keyboard.createCursorKeys();

        let velocityX = 0;
        let velocityY = 0;

        // UP
        if (cursors.up.isDown) {
            velocityY = -this.speed;
            this.play('up', true);
            this.inputs["up"] = true;
        } else {
            this.inputs["up"] = false;
        }

        // DOWN
        if (cursors.down.isDown) {
            velocityY = this.speed;
            this.play('down', true);
            this.inputs["down"] = true;
        } else {
            this.inputs["down"] = false;
        }

        // LEFT
        if (cursors.left.isDown) {
            velocityX = -this.speed;
            this.play('left', true);
            this.inputs["left"] = true;
        } else {
            this.inputs["left"] = false;
        }

        // RIGHT
        if (cursors.right.isDown) {
            velocityX = this.speed;
            this.play('right', true);
            this.inputs["right"] = true;
        } else {
            this.inputs["right"] = false;
        }

        // Нормализация скорости для диагонального движения
        const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (length > 0) {
            velocityX /= length;
            velocityY /= length;
        }

        // Перемещение игрока с учетом delta времени
        this.setX(this.x + velocityX * this.speed * (delta / 1000));
        this.setY(this.y + velocityY * this.speed * (delta / 1000));

        // Остановка анимации, если не нажата ни одна клавиша
        if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.stop();
        }
    }

    // Метод для получения состояния клавиш
    getInputs() {
        return this.inputs;
    }
}
