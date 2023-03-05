import {Enemy, EnemyFacing} from "./Enemy";
import GameScene from "../../../scenes/Game";
import {PhysicsSocket} from "../PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import {AABB} from "../../../util/AABB";

export class BossEnemy extends Enemy {

    constructor(scene: GameScene,
                physicsSocket: PhysicsSocket,
                origin: Vector2,
                private readonly arenaTopLeft: Vector2,
                private readonly arenaSize: Vector2) {
        super(scene, physicsSocket, origin);

    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        const player = this.physicsSocket.getPlayer();
        if(!player)
            return;

        if(AABB.isIn(player.x, player.y, this.arenaTopLeft.x, this.arenaTopLeft.y, this.arenaSize.x, this.arenaSize.y))
            console.log("Player in bounds");
    }

}
