import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import {matterCollisionPluginConfig} from "./config";

declare module "phaser" {
    interface Scene {
        [matterCollisionPluginConfig.mapping]: PhaserMatterCollisionPlugin;
    }
    /* eslint-disable @typescript-eslint/no-namespace */
    namespace Scenes {
        interface Systems {
            [matterCollisionPluginConfig.key]: PhaserMatterCollisionPlugin;
        }
    }
}
