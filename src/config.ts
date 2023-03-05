import GameConfig = Phaser.Types.Core.GameConfig;


import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import Constants from "./Constants";

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
    parent: "game",
    backgroundColor: "#efebea",
    scale: {
        width: 320 * Constants.UPSCALE_FACTOR,
        height: 180 * Constants.UPSCALE_FACTOR,
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
            // debug: {
            //     showBody: true,
            //     showStaticBody: true,
            // }
        }
    },

    plugins: {
        scene: [matterCollisionPluginConfig]
    }
} as GameConfig;
