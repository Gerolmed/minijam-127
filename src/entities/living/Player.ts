import {LivingEntity} from "./LivingEntity";
import PlayerAnimationKeys from "../../animations/PlayerAnimationKeys";
import {PlayerIngameInput} from "../../inputs/PlayerIngameInput";
import Vector2 = Phaser.Math.Vector2;
import {ProjectileShooter} from "../projectiles/shooting/ProjectileShooter";
import {IBodyDefinition} from "matter";
import {ChunkedTilemap} from "../../tilemap/ChunkedTilemap";
import Color = Phaser.Display.Color;
import {IDamageable} from "../../damage/IDamageable";
import {Item} from "../../items/Item";

export class Player extends LivingEntity {

    private speed = 20;
    private acceleration = 50;
    private playerInput!: PlayerIngameInput;
    private projectileShooter!: ProjectileShooter;
    private lastDir: Vector2 = new Vector2(0,1);

    private tilemap?: ChunkedTilemap;
    private items: Item[] = []


    public create() {
        super.create();

        this.setName("Player")

        this.playerInput = new PlayerIngameInput(this.scene);
        this.projectileShooter = new ProjectileShooter(this.gameScene, this);
        this.animator.load(PlayerAnimationKeys.BASE);
        this.animator.play(PlayerAnimationKeys.IDLE_DOWN);

        this.physicsOffset = new Vector2(-1,-2);
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

    public collectItem(item: Item) {
        this.items.push(item);
        item.apply(this);
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);

        this.playerInput.update(deltaTime);
        this.projectileShooter.update(deltaTime);

        const shootDir = this.handleShooting(deltaTime);
        const moveDir = this.handleMovement(deltaTime);

        this.handleAnimation(moveDir, shootDir);

        if(this.tilemap)
            this.tilemap.setPlayerPosition(this.x, this.y);
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

    getDamageColor() {
        return new Color(77,35,74);
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
        this.projectileShooter.tryShoot(new Vector2(this.x, this.y).add(this.getShootDirOffset(input)),input)
    }


    public setTilemap(tilemap: ChunkedTilemap) {
        this.tilemap = tilemap;
    }

    private getShootDirOffset(input: Vector2) {
        if(input.y < 0) return new Vector2(0, -15)

        return new Vector2(input.x * 7,0)
    }
}

export function isPlayer(obj: any): obj is Player {
    return obj && typeof obj.collectItem === "function";
}
