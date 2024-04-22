import {assert} from "chai";
import sinon from "sinon";
import { mountTask } from "task";
import { HarvestTargetType, TaskHarvest } from "task/instances/task_harvest";
import { TaskHelper } from "task/TaskHelper";

mountTask()

describe("task_harvest", () => {



    let task:ITask

    before(() => {

    });

    beforeEach(() => {
        const sourceTarget = sinon.createStubInstance(Source)
        const  mineralTarget = sinon.createStubInstance(Mineral)
        // const  creep = sinon.createStubInstance(Creep)

        // creep.name = 'creep'

        task = TaskHelper.harvest(sourceTarget)
    });

    it("111", () => {
        assert.isTrue(task.name === TaskHarvest.taskName);
    });

});
