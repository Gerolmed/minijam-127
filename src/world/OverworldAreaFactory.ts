import {AreaFactory} from "./AreaFactory";
import {Level} from "../types/Tilemap";
import {Area} from "./Area";
import {NormalArea} from "./NormalArea";

export class OverworldAreaFactory implements AreaFactory {

    produce(level: Level): Area {
        return new NormalArea(level);
    }

}
