import {Enemy} from "./Enemy";

export class Wolf extends Enemy {


    create() {
        super.create();
    }

    protected safeUpdate(deltaTime: number) {
        console.log(this.hasLineOfSight());
    }

}
