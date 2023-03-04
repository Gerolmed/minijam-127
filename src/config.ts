import GameConfig = Phaser.Types.Core.GameConfig;


import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

export const matterCollisionPluginConfig = {
    // The plugin class:
    plugin: PhaserMatterCollisionPlugin,
    // Where to store in Scene.Systems, e.g. scene.sys.matterCollision:
    key: "matterCollision" as "matterCollision",
    // Where to store in the Scene, e.g. scene.matterCollision:
    mapping: "matterCollision" as "matterCollision"
};


export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#33A5E7',
    scale: {
        width: 320 * 4,
        height: 180 * 4,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        pixelArt: true
    },

    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0
            },
            debug: {
                showBody: true,
                showStaticBody: true
            }
        }
    },

    plugins: {
        scene: [matterCollisionPluginConfig]
    }
} as GameConfig;
