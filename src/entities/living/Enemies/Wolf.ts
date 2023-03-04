import {Enemy} from "./Enemy";

export class Wolf extends Enemy {


    create() {
        super.create();
    }

    protected safeUpdate(deltaTime: number) {
        super.safeUpdate(deltaTime);
        console.log(this.hasLineOfSight());
    }

}
