
export abstract class Task implements ITask{

   static taskName:string

    constructor() {

	}


    abstract work():number
}
