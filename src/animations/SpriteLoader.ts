import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import PlayerAnimationKeys from "./PlayerAnimationKeys";
import {PlayerProjectileAnimationKeys, SpinnyProjectileAnimationKeys} from "./ProjectileAnimationKeys";
import {OpossumAnimationKeys, RatAnimationKeys, WolfAnimationKeys} from "./EnemyAnimationKeys";

export default function(load: LoaderPlugin) {

    // Player sprites
    load.aseprite(
        PlayerAnimationKeys.BASE,
        "assets/Sprites/Player/Player.png",
        "assets/Sprites/Player/Player.json",
    );
    // Enemy sprites
    load.aseprite(
        RatAnimationKeys.BASE,
        "assets/Sprites/Rat/Rat.png",
        "assets/Sprites/Rat/Rat.json",
    );

    load.aseprite(
        OpossumAnimationKeys.BASE,
        "assets/Sprites/Opossum/Opossum.png",
        "assets/Sprites/Opossum/Opossum.json",
    );

    load.aseprite(
        WolfAnimationKeys.BASE,
        "assets/Sprites/Wolf/Wolf.png",
        "assets/Sprites/Wolf/Wolf.json",
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
