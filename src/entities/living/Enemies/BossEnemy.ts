import {Enemy, EnemyAiParams, EnemyFacing} from "./Enemy";
import GameScene from "../../../scenes/Game";
import {PhysicsSocket} from "../PhysicsSocket";
import Vector2 = Phaser.Math.Vector2;
import {AABB} from "../../../util/AABB";
import {Jukebox} from "../../../audio/JukeBox";
import {BehaviourStateMachine} from "../../../behaviour/BehaviourStateMachine";
import {BehaviourBuilder} from "../../../behaviour/BehaviourBuilder";
import {CooldownManager} from "../../../behaviour/CooldownManager";

export class BossEnemy extends Enemy {


    private isInCombat = false;

    private readonly cooldownManager: CooldownManager;

    constructor(scene: GameScene,
                physicsSocket: PhysicsSocket,
                origin: Vector2,
                private readonly arenaTopLeft: Vector2,
                private readonly arenaSize: Vector2) {
        super(scene, physicsSocket, origin);

        const abilities = new Map<string, number>();
        abilities.set("bulletHell", 3 * 1000);
        this.cooldownManager = new CooldownManager(abilities);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        const player = this.physicsSocket.getPlayer();
        if(!player)
            return;

        if(!this.isInCombat && AABB.isIn(player.x, player.y, this.arenaTopLeft.x, this.arenaTopLeft.y, this.arenaSize.x, this.arenaSize.y))
            this.startBossFight();
    }


    protected createBehaviour(): BehaviourStateMachine<EnemyAiParams> {
        return new BehaviourBuilder<EnemyAiParams>()
            .addState("neutral")
                .onUpdate((param) => this.setToOrigin())
                .and()
            .addState("aggro")
                .onUpdate((param, delta) => this.moveIntoAttackRange(param, delta))
                .and()
            // .addState("bulletHell")
            //    .onUpdate((param, delta) => this.doBulletHell(param, delta))
            //    .and()
            .setStart("neutral")
                .addTransition("aggro", (param, delta) => this.shouldAggro(param, delta))
                .setDataProvider(() => this.getAiParams())
            .build()
    }

    protected doBulletHell() {

    }

    private startBossFight() {
        this.isInCombat = true;
        this.gameScene.getJukebox().setTheme("intro");
        // this.gameScene.getJukebox().
    }

}
