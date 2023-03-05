const Layers = {
    WALL:  0b1,
    PLAYER: 0b10,
    ENEMY: 0b100,
    PLAYER_PROJECTILE: 0b1000,
    ENEMY_PROJECTILE: 0b10000,
    ITEM: 0b100000,
    INTERACTABLE: 0b1000000,
    get All(): number {
        return Layers.WALL
            | Layers.PLAYER
            | Layers.ENEMY
            | Layers.PLAYER_PROJECTILE
            | Layers.ENEMY_PROJECTILE
            | Layers.ITEM
            | Layers.INTERACTABLE
    }
}

export default Object.freeze(Layers);
