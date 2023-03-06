import {IEntityFactory} from "./IEntityFactory";
import {Entity} from "../Entity";
import {EntityInstance, Layer} from "../../types/Tilemap";
import {PhysicsSocket} from "../living/PhysicsSocket";
import GameScene from "../../scenes/Game";
import {NPCEntity} from "../living/interactibles/NPCEntity";
import PlayerAnimationKeys, {
    BingusAnimationKeys,
    GanymedeAnimationKeys,
    MaxwellAnimationKeys,
    NpcAnimationType,
    NyanCatAnimationKeys,
    RaymondAnimationKeys,
    ThurstonAnimationKeys
} from "../../animations/PlayerAnimationKeys";
import Vector2 = Phaser.Math.Vector2;


export class NPCFactory implements IEntityFactory {



    constructor(private readonly scene: GameScene,
                private readonly physicsSocket: PhysicsSocket,
                private readonly addEntity: <T extends Entity>(entity: T) => T) {
    }

    produce(instance: EntityInstance, layer: Layer, chunkX: number, chunkY: number, scene: Phaser.Scene): Entity {

        const lines: string[] = instance.fieldInstances.find(field => field.__identifier === "DialogLines")?.__value as string[] || [];
        const globalLine = instance.fieldInstances.find(field => field.__identifier === "AppendProgressionHelp")!.__value as boolean;
        const oneshot = instance.fieldInstances.find(field => field.__identifier === "Oneshot")!.__value as boolean;
        const skin = instance.fieldInstances.find(field => field.__identifier === "Skin")!.__value as string;
        const name = instance.fieldInstances.find(field => field.__identifier === "Name")!.__value as string;

        const pos = new Vector2(instance.__grid[0] * layer.__gridSize + chunkX, instance.__grid[1] * layer.__gridSize + chunkY);

        let skinAnim: NpcAnimationType = PlayerAnimationKeys;

        if(skin === "Maxwell") {
            skinAnim = MaxwellAnimationKeys;
        } else if(skin === "Bingus") {
            skinAnim = BingusAnimationKeys;
        } else if(skin === "Thurston") {
            skinAnim = ThurstonAnimationKeys;
        } else if(skin === "Raymond") {
            skinAnim = RaymondAnimationKeys;
        } else if(skin === "Ganymede") {
            skinAnim = GanymedeAnimationKeys;
        } else if(skin === "NeonCat") {
            skinAnim = NyanCatAnimationKeys;
        }

        const npc = new NPCEntity(this.scene, pos.x, pos.y, this.physicsSocket, instance.iid, lines, oneshot, globalLine, skinAnim, name);

        return this.addEntity(npc);
    }

    supports(typeID: number): boolean {
        return typeID === 52;
    }

}
