class TimeManager {

    private gameFrozen = false;
    private uiFrozen = false;

    public setGameFreeze(freeze: boolean) {

    }
    public setUIFrozen(freeze: boolean) {
        this.uiFrozen = freeze;
    }

    get isUIFrozen(): boolean {
        return this.uiFrozen;
    }

    get isGameFrozen(): boolean {
        return this.isUIFrozen || this.gameFrozen;
    }
}

export default new TimeManager();
