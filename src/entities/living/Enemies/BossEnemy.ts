import {Enemy, EnemyAiParams, EnemyFacing} from "./Enemy";
import GameScene from "../../../scenes/Game";
import {PhysicsSocket} from "../PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import {AABB} from "../../../util/AABB";
import {Jukebox} from "../../../audio/JukeBox";
import {BehaviourStateMachine} from "../../../behaviour/BehaviourStateMachine";

export class BossEnemy extends Enemy {


    private isInCombat = false;

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

        if(!this.isInCombat && AABB.isIn(player.x, player.y, this.arenaTopLeft.x, this.arenaTopLeft.y, this.arenaSize.x, this.arenaSize.y))
            this.startBossFight();
    }

    private startBossFight() {
        this.isInCombat = true;
        this.gameScene.getJukebox().setTheme("intro");
        // this.gameScene.getJukebox().
    }

}
