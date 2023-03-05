import {IEntityFactory} from "./IEntityFactory";
import {Entity} from "../Entity";
import {EntityInstance, Layer} from "../../types/Tilemap";
import {PhysicsSocket} from "../living/PhysicsSocket";
import GameScene from "../../scenes/Game";
import {NPCEntity} from "../living/interactibles/NPCEntity";
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

        const pos = new Vector2(instance.__grid[0] * layer.__gridSize + chunkX, instance.__grid[1] * layer.__gridSize + chunkY);

        const npc = new NPCEntity(this.scene, pos.x, pos.y, this.physicsSocket, instance.iid, lines, oneshot, globalLine);

        return this.addEntity(npc);
    }

    supports(typeID: number): boolean {
        return typeID === 52;
    }

}
