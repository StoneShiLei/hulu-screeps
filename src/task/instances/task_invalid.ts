import { Task } from "./task";


export class TaskInvalid extends Task {

    static taskName = 'invalid'

    constructor(target: any, options = {} as TaskOption) {
		super('INVALID', target, options);
	}

    isValidTask(): boolean {
        return false
    }
    isValidTarget(): boolean {
        return false
    }
    work(): number {
        return OK
    }

}
