import {Scene} from "phaser";
import WebAudioSound = Phaser.Sound.WebAudioSound;

type ThemeTrack = {
    key: string,
    weight?: number,

}
type TrackList = {
    [key: string]: ThemeTrack[]

}

type TrackConfig = {paths: string[], weight?: number}[]


type ThemeConfig = TrackConfig

export type JukeboxConfig = {
    defaultTheme: string,
    themes: {
        [key: string]: ThemeConfig
    },
}

const THEME_CROSS_FADE = 5;

export class Jukebox {

    constructor(
        private scene: Scene,
        private config: JukeboxConfig,
    ) {
    }

    private trackList: TrackList = {};
    private previous?: WebAudioSound;
    private fading = false;
    private fadeValue = 0;
    private fadeDuration = 0;
    private totalFadeDuration = 0;
    private current?: WebAudioSound;
    private activeTheme!: string;

    public load() {

        Object.entries(this.config.themes).forEach(value => {
            const [theme, themeConfig] = value;
            const tracks: ThemeTrack[] = [];

            themeConfig.forEach((themeConfigEntry, index) => {
                const audioKey = theme + "_"+ index;
                tracks.push({
                    key: audioKey,
                    weight: themeConfigEntry.weight,
                })

                this.scene.load.audio(audioKey, themeConfigEntry.paths)
            })

            this.trackList[theme] = tracks;
        })

    }

    public start() {
        this.setTheme(this.config.defaultTheme, true);
    }

    public setTheme(theme: string, immediate: boolean = false, fadeDuration: number = 1) {

        if(this.activeTheme === theme) return;

        this.activeTheme = theme;

        this.doFade(immediate, fadeDuration, this.getNext());
    }

    private doFade(immediate: boolean, fadeDuration: number, newSound: WebAudioSound | undefined) {
        this.fading = !immediate;

        if (immediate || !this.current) {
            this.fading = false;
            this.fadeValue = 1;
        }

        this.fadeDuration = 0;
        this.totalFadeDuration = fadeDuration;

        this.previous?.destroy();
        this.previous = this.current;

        this.current = newSound;
    }

    private getAudio(audioKey: string) {
        const instance = this.scene.sound.add(audioKey, {volume: 0}) as WebAudioSound
        instance.play()
        return instance;
    }



    public update(deltaTime: number) {
        this.current?.setVolume(this.fadeValue);
        this.previous?.setVolume(1-this.fadeValue);


        if(this.fading) {
            this.fadeDuration += deltaTime;
            this.fadeValue = Math.min(this.fadeDuration/this.totalFadeDuration, 1)
            if (this.fadeValue === 1) this.fading = false;
        } else if(this.previous) {
            this.previous.destroy();
            this.previous = undefined;
        }

        if(!this.fading && this.current && this.current.totalDuration - this.current.seek <= THEME_CROSS_FADE) {
            this.doFade(false, THEME_CROSS_FADE, this.getNext())
        }

    }

    private getNext() {

        function getRandomInt(max: number) {
            return Math.floor(Math.random() * max);
        }

        const trackList = this.trackList[this.activeTheme];
        if(!trackList) return undefined;

        let totalWeight = 0;
        trackList.forEach(cfg => totalWeight += (cfg.weight || 1));

        let weightSelect = getRandomInt(totalWeight);

        let track = trackList[0];

        for (let trackKey of trackList) {
            const weight = trackKey.weight || 1;
            if(weight <= weightSelect) {
                weightSelect -= weight;
                continue;
            }
            track = trackKey;
            break;
        }

        return this.getAudio(track.key);
    }


    kill() {
        this.current?.stop()
        this.previous?.stop()
    }
}
