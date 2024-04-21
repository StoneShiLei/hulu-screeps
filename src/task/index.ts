import { PrototypeHelper } from "utils/PrototypeHelper";
import { CreepExtension } from "./prototypes/creep";

export function mountTask(){
    PrototypeHelper.assignPrototype(Creep,CreepExtension)
}
