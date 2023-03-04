const Layers = {
    WALL:  0b1,
    PLAYER: 0b10,
    ENEMY: 0b100,
    PLAYER_PROJECTILE: 0b1000,
    ENEMY_PROJECTILE: 0b10000,
}

export default Object.freeze(Layers);
