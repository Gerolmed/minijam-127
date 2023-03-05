import {InteractableEntity} from "./InteractableEntity";
import {Player} from "../Player";
import {DialogBox} from "../../../ui/DialogBox";
import TimeManager from "../../../TimeManager";
import GameScene from "../../../scenes/Game";
import {PhysicsSocket} from "../PhysicsSocket";
import {WorldStoreManager} from "../../../world/WorldSave";
import {GLOBAL_DIALOG_DATA} from "../../../util/DialogData";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export class NPCEntity extends InteractableEntity {
    constructor(
        scene: GameScene,
        x: number,
        y: number,
        socket: PhysicsSocket,
        private readonly entityId: string,
        private readonly lines: string[],
        private readonly oneshot: boolean,
        private readonly globalLine: boolean
    ) {
        super(scene, x, y, socket);
    }

    create() {
        super.create();
        this.setDepth(90)
    }

    death() {
        // DO NOTHING
    }


    protected doInteract(player: Player) {
        super.doInteract(player);
        TimeManager.setGameFreeze(true);
        player.forceIdle();

        let lines: string[] = []


        const store = WorldStoreManager.get().getStore();

        if(!this.oneshot || !store.raw[this.entityId + "_dlg_oneshot"]) {
            store.raw[this.entityId + "_dlg_oneshot"] = true;
            lines.push(...this.lines)
        }

        if(this.globalLine) {
            lines.push(GLOBAL_DIALOG_DATA.getRandomCurrent())
        }

        if(lines.length === 0) {
            const parts = ["Go away", "Leave me be", "...", "Aren't there any enemies\nyou can go kill?"]
            lines.push(parts[getRandomInt(parts.length)])
        }


        this.doDialogs(lines).finally(() => {
            TimeManager.setGameFreeze(false)
            this.showIndicator()
        })
    }

    private async doDialogs(lines: string[]): Promise<void> {
        for (let line of lines) {
            const box = this.scene.add.existing(new DialogBox(this.scene, this.x, this.y-12, line))

            await box.start();
        }
    }
}
