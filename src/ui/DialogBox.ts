import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import NineSlice = Phaser.GameObjects.NineSlice;
import Text = Phaser.GameObjects.Text;
import {Scene} from "phaser";
import {doTextTween} from "../animations/ColorUtils";

export class DialogBox extends Container {
    private box!: Phaser.GameObjects.NineSlice;
    private text!: Phaser.GameObjects.Text;
    private nameText!: Phaser.GameObjects.Text;
    private readonly renderText: string[];
    private renderedText: string[] = [];
    private finished: boolean = false;
    private skipped: boolean = false;
    private skipBtn!: Phaser.Input.Keyboard.Key;
    private resolve?: () => void;

    constructor(scene: Scene, x: number, y: number, text: string, private readonly charName?: string) {
        super(scene, x, y);


        this.renderText = []
        text.replaceAll("/n", "\n").split("\n").forEach(part => {
            let piece = ""

            for (let i = 0; i < part.length; i++) {
                piece += part[i];
                if(piece.length === 26) {
                    this.renderText.push(piece);
                    piece = "";
                }
            }

            if(piece.length !== 0) {
                this.renderText.push(piece);
            }
        })
    }

    async start(): Promise<void> {
        this.skipBtn = this.scene.input.keyboard?.addKey("space")!;

        this.box = new NineSlice(this.scene, 0, 0, "dialog_box", 0, 9*10, 9, 3, 3, 3, 3).setOrigin(0,0);
        this.text = new Text(this.scene, 0,0, "", {fontFamily: "EndFont", fontSize: 100}).setScale(0.05 )
        this.nameText = new Text(this.scene, 0,0, this.charName || "", {fontFamily: "EndFont", fontSize: 50, color: "#d4715d", stroke: "#4d234a", strokeThickness: 30}).setScale(0.1 )
        this.add(this.box)
        this.add(new Sprite(this.scene, 0, 0, "dialog_arrow").setOrigin(0,1))
        this.add(this.text)
        this.add(this.nameText)

        this.skipBtn.on("down", () => this.trySkip())

        this.runAnimation().then(() => {/*Nothing*/});

        return new Promise<void>(resolve => this.resolve = resolve);
    }

    private async runAnimation() {
        await this.tweenLines()
        await new Promise(resolve => setTimeout(resolve, 5000))
        this.finish();
    }

    private adjustBoxPosition() {
        this.box.setSize(this.box.width, this.renderedText.length * 6+4);
        this.box.setY(-5-this.box.height)
        this.box.setX(12-this.box.width/2)
        this.text.setY(-5-this.box.height + 2)
        this.text.setX(12-this.box.width/2 + 3)
        this.nameText.setY(-12-this.box.height)
        this.nameText.setX(12-this.box.width/2)
    }

    private async tweenLines() {
        let i = 0;
        for (let line of this.renderText) {
            this.renderedText.push("");
            this.updateText();
            this.adjustBoxPosition();
            await doTextTween(this.scene, line, 100 * line.length, txt => {
                this.renderedText[i] = txt;
                this.updateText();
            }, () => this.skipped)
            if(this.skipped) return
            i++;
        }
    }

    private updateText() {
        this.text.height = this.renderedText.length * 6;
        this.text.setText(this.renderedText.join("\n"))
    }

    private finish() {
        if(this.finished && this.resolve) return
        this.finished = true;
        this.destroy(true)
        this.skipBtn.destroy()
        this.resolve?.();
    }

    private trySkip() {
        if(this.skipped) this.finish()
        else {
            this.skipped = true;

            this.renderedText = this.renderText;
            this.updateText();
            this.adjustBoxPosition();
        }
    }
}
