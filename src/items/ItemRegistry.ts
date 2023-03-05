import {Item} from "./Item";
import {SuperCatfoodCan} from "./impl/SuperCatfoodCan";
import {MinorFish} from "./impl/MinorFish";
import {GreaterFish} from "./impl/GreaterFish";
import {ExtraProjectile} from "./impl/ExtraProjectile";
import {PawsOfSwiftness} from "./impl/PawsOfSwiftness";
import {PawsOfGliding} from "./impl/PawsOfGliding";
import {Slingshot} from "./impl/Slingshot";
import {BigProjectile} from "./impl/BigProjectile";
import {BiggerBrush} from "./impl/BiggerBrush";
import {SpecialConcoction} from "./impl/SpecialConcoction";
import {Catvision} from "./impl/Catvision";
import {SlingTail} from "./impl/SlingTail";
import {TripleProjectiles} from "./impl/TripleProjectiles";

class ItemRegistry {

    private readonly itemMap = new Map<string, (id: string) => Item>();

    getItem(id: string): Item | undefined {
        return this.itemMap.get(id)?.(id);
    }

    register(id: string, item: (id: string) => Item) {
        this.itemMap.set(id, item);
    }

}

const reg = new ItemRegistry()


reg.register("Paws_of_Swiftness", (id) => new PawsOfSwiftness(id))
reg.register("Slingshot", (id) => new Slingshot(id))
reg.register("Bigger_Brush", (id) => new BiggerBrush(id))
reg.register("Big_Projectiles", (id) => new BigProjectile(id))
reg.register("Special_Concoction", (id) => new SpecialConcoction(id))

reg.register("Super_Catfood_Can", (id) => new SuperCatfoodCan(id))
reg.register("Minor_Fish", (id) => new MinorFish(id))
reg.register("Catvision", (id) => new Catvision(id))

reg.register("Sling_Tail", (id) => new SlingTail(id))
reg.register("Extra_Projectile", (id) => new ExtraProjectile(id))
reg.register("Paws_of_Gliding", (id) => new PawsOfGliding(id))

reg.register("Greater_Fish", (id) => new GreaterFish(id))
reg.register("Triple_Projectiles", (id) => new TripleProjectiles(id))

export default reg;
