import {Enemy} from "./Enemy";
import Vector2 = Phaser.Math.Vector2;

export class Wolf extends Enemy {


    private readonly SPEED = 50;
    private readonly RANGE = 50;

    create() {
        super.create();
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        if(this.hasLineOfSight()) {
            const player = this.physicsSocket.getPlayer()!;

            const playerDir = [player.x - this.x, player.y - this.y];
            const length = Math.sqrt(playerDir[0] * playerDir[0] + playerDir[1] * playerDir[1]);

            if(length <= this.RANGE) {
                // this.projectileShooter.tryShoot(new Vector2(playerDir[0] / length, playerDir[1] / length))
                return;
            }

            this.scene.matter.setVelocity(
                this.rigidbody,
                playerDir[0] / length * this.SPEED * deltaTime,
                playerDir[1] / length * this.SPEED * deltaTime
            )
        }
    }

}
