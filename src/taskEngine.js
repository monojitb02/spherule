'use strict';
const Task = require('./task');
module.exports = class TaskEngine {
    constructor() {
        this.tasks = [];
        this.hasData = false;
    }
    getTaskById(taskId) {
        return this.tasks.find(t => t.taskId === taskId);
    }
    getTaskByRef(task) {
        return this.tasks.find(t => t.task === task);
    }
    registerTask(task) {
        const registeredTask = this.getTaskByRef(task);
        if (registeredTask) {
            return registeredTask._id
        } else {
            const newTask = new Task(task);
            this.tasks.push(newTask);
            return newTask._id;
        }
    }
    registerData(data, idField) {
        this.hasData = true;
        this.masterDataList = data;
        this.dataIdentity = idField;
    }
    enque(taskId, data) {
        idField = idField || this.dataIdentity;
        const registeredTask = this.getTaskById(taskId);
        registeredTask.enque(dataList.map(d => d[this.dataIdentity]));
    }
}