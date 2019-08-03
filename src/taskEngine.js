'use strict';
const Task = require('./task');
const _ = require('lodash');
module.exports = class TaskEngine {
    constructor() {
        this.tasks = {};
    }
    getTaskById(taskId) {
        return this.tasks[taskId];
    }
    getTaskByRef(task) {
        const taskId = _.findKey(this.tasks, (t => t.task === task));
        return this.tasks[taskId];
    }
    registerTask(task) {
        let registeredTask = this.getTaskByRef(task);
        if (!registeredTask) {
            const newTask = new Task(task);
            this.tasks[newTask._id] = newTask;
            registeredTask = newTask;
        }
        return registeredTask;
    }
    async runAllTasks(options = {}) {
        return await Promise.all(
            _.chain(this.tasks)
                .values()
                .map(task => task.run(options))
                .value()
        );
    }
}