import {LivingEntity} from "./LivingEntity";
import PlayerAnimationKeys from "../../animations/PlayerAnimationKeys";
import {PlayerIngameInput} from "../../inputs/PlayerIngameInput";
import Vector2 = Phaser.Math.Vector2;
import {ProjectileShooter} from "../projectiles/shooting/ProjectileShooter";
import {IBodyDefinition} from "matter";

export class Player extends LivingEntity {

    private speed = 20;
    private acceleration = 50;
    private playerInput!: PlayerIngameInput;
    private projectileShooter!: ProjectileShooter;
    private lastDir: Vector2 = new Vector2(0,1);

    public create() {

        this.playerInput = new PlayerIngameInput(this.scene);
        this.projectileShooter = new ProjectileShooter(this.gameScene, this);
        this.animator.load(PlayerAnimationKeys.BASE);
        this.animator.play(PlayerAnimationKeys.IDLE_DOWN);

        this.physicsOffset = new Vector2(-1,-2);

        this.setHandler({
            onHealthChange(health: number, maxHealth: number) {
                console.log("hit me")
            }
        })
    }

    protected createPhysicsConfig(): IBodyDefinition {
        return {
            ...super.createPhysicsConfig(),
            frictionAir: .3,
            mass: 20,
            inverseMass: 1/20,
            label: "player"
        };
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        this.playerInput.update(deltaTime);
        this.projectileShooter.update(deltaTime);

        const shootDir = this.handleShooting(deltaTime);
        const moveDir = this.handleMovement(deltaTime);

        this.handleAnimation(moveDir, shootDir);
    }

    private handleShooting(deltaTime: number): Vector2 {
        const input = this.playerInput.getCombatVectorRaw();

        this.tryShoot(input);

        return input;
    }

    private handleMovement(deltaTime: number): Vector2  {
        const dir = this.playerInput.getMovementVector();
        let targetX = dir.x * this.speed;
        let targetY = dir.y * this.speed;
        const current = this.rigidbody.velocity;

        if(targetX > 0) {
            targetX = Math.min(current.x + dir.x * this.acceleration * deltaTime, targetX)
            targetX = Math.max(current.x, targetX)
        } else {
            targetX = Math.max(current.x + dir.x * this.acceleration * deltaTime, targetX)
            targetX = Math.min(current.x, targetX)
        }
        if(targetY > 0) {
            targetY = Math.min(current.y + dir.y * this.acceleration * deltaTime, targetY)
            targetY = Math.max(current.y, targetY)
        } else {
            targetY = Math.max(current.y + dir.y * this.acceleration * deltaTime, targetY)
            targetY = Math.min(current.y, targetY)
        }

        this.scene.matter.setVelocity(this.rigidbody, targetX, targetY);

        return dir;
    }


    private handleAnimation(moveDir: Vector2, shootDir: Vector2) {

        let dir = shootDir.lengthSq() > 0.1 ? shootDir : moveDir;
        let walking = moveDir.lengthSq() > 0.1;
        if(dir.lengthSq() > 0.1) {
            this.lastDir = dir;
        } else {
            dir = this.lastDir;
        }

        if(dir.y > 0) {
            this.animator.play(walking ? PlayerAnimationKeys.WALK_DOWN : PlayerAnimationKeys.IDLE_DOWN)
        } else if(dir.y < 0) {
            this.animator.play(walking ? PlayerAnimationKeys.WALK_UP : PlayerAnimationKeys.IDLE_UP)
        } else {
            if(dir.x > 0) {
                this.animator.play(walking ? PlayerAnimationKeys.WALK_RIGHT : PlayerAnimationKeys.IDLE_RIGHT)
            } else if(dir.x < 0) {
                this.animator.play(walking ? PlayerAnimationKeys.WALK_LEFT : PlayerAnimationKeys.IDLE_LEFT)
            }
        }
    }


    hasShot = false;

    private tryShoot(input: Vector2) {
        if (input.lengthSq() < .1) return;
        this.projectileShooter.tryShoot(input)
    }

}
