import { Task } from "./task";

export class TaskHarvest extends Task {

    static taskName:string = 'harvest'

    constructor() {
		super()
	}

    work():number {
        throw new Error("Method not implemented.");
    }

}
