import Phaser from 'phaser';
import {Player} from "../entities/living/Player";
import {Entity} from "../entities/Entity";
import {LivingEntity} from "../entities/living/LivingEntity";

export default class Demo extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
    }

    private addEntity(entity: Entity) {
        entity.create();
        this.add.existing(entity);
    }

    create() {
        this.addEntity(new Player(this, 300, 100))
        this.addEntity(new LivingEntity(this, 200, 100))
    }
}
