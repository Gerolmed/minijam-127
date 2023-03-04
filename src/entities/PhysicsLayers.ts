const Layers = {
    WALL:  0b1,
    PLAYER: 0b10,
    ENEMY: 0b100,
    PLAYER_PROJECTILE: 0b1000,
    ENEMY_PROJECTILE: 0b10000,
    get All(): number {
        return Layers.WALL
            | Layers.PLAYER
            | Layers.ENEMY
            | Layers.PLAYER_PROJECTILE
            | Layers.ENEMY_PROJECTILE
    }
}

export default Object.freeze(Layers);
