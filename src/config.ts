import GameConfig = Phaser.Types.Core.GameConfig;

export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#33A5E7',
    scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
    }
} as GameConfig;
