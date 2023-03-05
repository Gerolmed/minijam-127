import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import PlayerAnimationKeys from "./PlayerAnimationKeys";
import {
    PlayerProjectileAnimationKeys,
    SpinnyProjectileAnimationKeys
} from "./ProjectileAnimationKeys";
import {OpossumAnimationKeys, RatAnimationKeys, WolfAnimationKeys} from "./EnemyAnimationKeys";
import {CampfireAnimationKeys} from "./ObjectAnimationKeys";

export default function(load: LoaderPlugin) {



    load.image("splat_1", "assets/Sprites/Splats/Orange1.png");
    load.image("splat_2", "assets/Sprites/Splats/Orange2.png");
    load.image("splat_3", "assets/Sprites/Splats/Orange3.png");
    load.image("splat_4", "assets/Sprites/Splats/Orange4.png");
    load.image("splat_5", "assets/Sprites/Splats/Orange5.png");
    load.image("splat_6", "assets/Sprites/Splats/Orange6.png");
    load.image("splat_7", "assets/Sprites/Splats/Orange7.png");
    load.image("splat_8", "assets/Sprites/Splats/Orange8.png");
    load.image("splat_9", "assets/Sprites/Splats/Orange9.png");

    load.image("dialog_box", "assets/Sprites/UI/DialogBox.png");
    load.image("dialog_arrow", "assets/Sprites/UI/DialogArrow.png");


    // Load items
    load.image("item_anti_rat", "assets/Sprites/Items/AntiRat.png");
    load.image("item_bigger_brush", "assets/Sprites/Items/BiggerBrush.png");
    load.image("item_bigger_projectile", "assets/Sprites/Items/BigProjectile.png");
    load.image("item_catfood", "assets/Sprites/Items/Catfood.png");
    load.image("item_catvision", "assets/Sprites/Items/CatVision.png");
    load.image("item_extra_projectile", "assets/Sprites/Items/ExtraProjectile.png");
    load.image("item_greater_fish", "assets/Sprites/Items/GreaterFish.png");
    load.image("item_minor_fish", "assets/Sprites/Items/MinorFish.png");
    load.image("item_opossum_obliterator", "assets/Sprites/Items/OpossumObliterator.png");
    load.image("item_paws_glide", "assets/Sprites/Items/PawsOfGliding.png");
    load.image("item_paws_swift", "assets/Sprites/Items/PawsOfSwiftness.png");
    load.image("item_sling", "assets/Sprites/Items/Sling.png");
    load.image("item_sling_tail", "assets/Sprites/Items/SlingTail.png");
    load.image("item_special_concoction", "assets/Sprites/Items/SpecialConcoction.png");
    load.image("item_triple_projectile", "assets/Sprites/Items/TripleProjectile.png");

    // Campfire
    load.aseprite(
        CampfireAnimationKeys.BASE,
        "assets/tilesets/Campfire.png",
        "assets/tilesets/Campfire.json",
    );
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
