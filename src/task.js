'use strict';
const uuid = require('uuid/v4');
module.exports = class TaskEngine {
    constructor(task) {
        this.taskId = uuid();
        this.task = task;
        this.dataIds = new Set();
        this.dataPoint = null;
    }
    enque(dataIds){
        this.dataIds.add(dataIds);
    }
    async run(dataList, idField){
        return this.task(dataList.filter());
    }
}