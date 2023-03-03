import GameConfig = Phaser.Types.Core.GameConfig;

export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#33A5E7',
    scale: {
        width: 256 * 4,
        height: 144 * 4,
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
    }
} as GameConfig;
