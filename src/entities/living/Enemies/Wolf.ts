import {Enemy, EnemyState} from "./Enemy";


export class Wolf extends Enemy {


    private readonly SPEED = 52;
    private readonly RETREAT_SPEED = 25;
    private readonly ATTACK_RANGE = 50;
    private readonly AGGRO_RANGE = 100;
    private readonly AGGRO_RANGE_ORIGIN = 100;
    private readonly PATIENCE = 3 * 1000;
    private readonly FOLLOW_DISTANCE = 150;
    private readonly RETREAT_DISTANCE_MAX = 250;
    private readonly RETREAT_DURATION_MAX = 5 * 1000;

    private lastPlayerSpotted = Date.now();
    private startRetreating = 0;
    private aState: EnemyState = EnemyState.NEUTRAL;

    create() {
        super.create();
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        const player = this.physicsSocket.getPlayer();
        if(!player) return;

        const hasLos = this.hasLineOfSight();
        const playerDir = [player.x - this.x, player.y - this.y];
        const distanceToPlayer = Math.sqrt(playerDir[0] * playerDir[0] + playerDir[1] * playerDir[1]);
        const distanceToOrigin = Math.sqrt((this.x - this.origin.x) * (this.x - this.origin.x) + (this.y - this.origin.y) * (this.y - this.origin.y));
        const timeLastSpotted = Date.now() - this.lastPlayerSpotted;

        if(hasLos)
            this.lastPlayerSpotted = Date.now();

        if(this.aState === EnemyState.AGGRO && (distanceToOrigin> this.FOLLOW_DISTANCE || timeLastSpotted > this.PATIENCE)) {
            this.aState = EnemyState.RETREATING;
            this.startRetreating = Date.now();
        }
        const timeRetreating = Date.now() - this.startRetreating;

        if(this.aState !== EnemyState.AGGRO && distanceToPlayer < this.AGGRO_RANGE && distanceToOrigin < this.AGGRO_RANGE_ORIGIN)
            this.aState = EnemyState.AGGRO;

        if(this.aState === EnemyState.AGGRO && hasLos && distanceToPlayer > this.ATTACK_RANGE) {
            this.scene.matter.setVelocity(
                this.rigidbody,
                playerDir[0] / distanceToPlayer * this.SPEED * deltaTime,
                playerDir[1] / distanceToPlayer * this.SPEED * deltaTime
            )
        }

        if(this.aState === EnemyState.RETREATING) {
            this.scene.matter.setVelocity(
                this.rigidbody,
                -playerDir[0] / distanceToPlayer * this.RETREAT_SPEED * deltaTime,
                -playerDir[1] / distanceToPlayer * this.RETREAT_SPEED * deltaTime
            )
        }
        if(this.aState === EnemyState.RETREATING && (distanceToOrigin > this.RETREAT_DISTANCE_MAX || timeRetreating > this.RETREAT_DURATION_MAX)) {
            this.aState = EnemyState.NEUTRAL;
        }

        if(this.aState === EnemyState.NEUTRAL) {
            this.rigidbody.position.x = this.origin.x;
            this.rigidbody.position.y = this.origin.y;
        }

        /*
        if(this.hasLineOfSight()) {
            const player = this.physicsSocket.getPlayer()!;

            const playerDir = [player.x - this.x, player.y - this.y];
            const length = Math.sqrt(playerDir[0] * playerDir[0] + playerDir[1] * playerDir[1]);

            if(length > this.ATTACK_RANGE) {
                this.scene.matter.setVelocity(
                    this.rigidbody,
                    playerDir[0] / length * this.SPEED * deltaTime,
                    playerDir[1] / length * this.SPEED * deltaTime
                )

                this.lastPlayerSpotted = Date.now();
            }
        }

        const distanceToOrigin = (this.x - this.origin.x)^2 + (this.y - this.origin.y)^2;
        const playerNotSeenTime = Date.now() - this.lastPlayerSpotted;
        if(playerNotSeenTime > this.PATIENCE || distanceToOrigin > this.FOLLOW_DISTANCE) {
            this.
        }

         */
    }

}
