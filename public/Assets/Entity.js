// Модель любой сущности (Игрок, моб, текстура)
export class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.type = type; // Если нужно сохранить тип сущности

        // Добавление сущности в сцену
        this.scene.add.existing(this);
    }
}
