import {Level} from "../types/Tilemap";
import {Area} from "./Area";

export interface AreaFactory {

    produce(level: Level): Area;

}
