class AudioManager {
    getSFXVolume(value: number = 1): number {
        return value * .3;
    }
    getMusicVolume(value: number = 1): number {
        return value * .2;
    }
}

export default new AudioManager();
