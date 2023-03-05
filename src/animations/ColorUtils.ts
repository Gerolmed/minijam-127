import {Scene} from "phaser";
import Color = Phaser.Display.Color;

export function doColorTween(scene: Scene, from: Color, to: Color, duration: number, setColor: (col: number) => void) {
    return new Promise<void>(resolve => {
        scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: duration,
            onUpdate: (tween) => {
                const newTarget = Color.Interpolate.ColorWithColor(
                    from,
                    to,
                    100,
                    tween.getValue()
                )

                const color = (newTarget.r << 16) + (newTarget.g << 8) + newTarget.b;
                setColor(color)
            },
            onComplete: () => {
                resolve();
            }
        }).play()
    })
}
export function doAlphaTween(scene: Scene, from: number, to: number, duration: number, setAlpha: (a: number) => void) {
    return new Promise<void>(resolve => {
        scene.tweens.addCounter({
            from: from,
            to: to,
            duration: duration,
            onUpdate: (tween) => {

                setAlpha(tween.getValue())
            },
            onComplete: () => {
                resolve();
            }
        }).play()
    })
}
export function doTextTween(scene: Scene, text: string, duration: number, setText: (txt: string) => void) {
    return new Promise<void>(resolve => {
        scene.tweens.addCounter({
            from: 0,
            to: text.length+1,
            duration: duration,
            onUpdate: (tween) => {

                setText(text.slice(0, Math.min(Math.floor(tween.getValue()), text.length)))
            },
            onComplete: () => {
                resolve();
            }
        }).play()
    })
}
