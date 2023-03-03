import Vector2 = Phaser.Math.Vector2;

export interface IDamageable {

    damage(damage: number, knockBack?: Vector2): void;

    addMaxHealth(value: number): void;

    setHandler(handler: IHealthStatHandler): void;
}

export interface IHealthStatHandler {
    onHealthChange(health: number, maxHealth: number): void;
}
