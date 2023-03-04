import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import PlayerAnimationKeys from "./PlayerAnimationKeys";

export default function(load: LoaderPlugin) {

    // Player sprites
    load.aseprite(
        PlayerAnimationKeys.BASE,
        "assets/Sprites/Player/Player.png",
        "assets/Sprites/Player/Player.json",
    );
}
