'use strict';
const Task = require('./task');
const _ = require('lodash');
class TaskEngine {
    constructor() {
        this.tasks = {};
    }
    getTaskById(taskId) {
        return this.tasks[taskId];
    }
    addTask(task) {
        this.tasks[task._id] = task;
    }
    getTaskByRef(task) {
        const taskId = _.findKey(this.tasks, (t => t.task === task));
        return this.tasks[taskId];
    }
    registerTask(task) {
        if (task instanceof Task) {
            this.addTask(task);
            return task;
        }
        const registeredTask = this.getTaskByRef(task);
        if (registeredTask) {
            return registeredTask;
        }
        const newTask = new Task(task);
        this.addTask(newTask);
        return newTask;
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
module.exports = TaskEngine;