import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import PlayerAnimationKeys from "./PlayerAnimationKeys";
import {PlayerProjectileAnimationKeys, SpinnyProjectileAnimationKeys} from "./ProjectileAnimationKeys";

export default function(load: LoaderPlugin) {

    // Player sprites
    load.aseprite(
        PlayerAnimationKeys.BASE,
        "assets/Sprites/Player/Player.png",
        "assets/Sprites/Player/Player.json",
    );


    // Projectile Sprites
    load.aseprite(
        PlayerProjectileAnimationKeys.BASE,
        "assets/Sprites/Projectiles/PlayerShot.png",
        "assets/Sprites/Projectiles/PlayerShot.json",
    );
    load.aseprite(
        SpinnyProjectileAnimationKeys.BASE,
        "assets/Sprites/Projectiles/Spinny.png",
        "assets/Sprites/Projectiles/Spinny.json",
    );
}
