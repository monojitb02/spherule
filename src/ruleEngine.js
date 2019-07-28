'use strict';
const uuid = require('uuid/v4');
const Equation = require('./equation');
const TaskEngine = require('./taskEngine');
module.exports = class RuleEngine {
    constructor({ $perform, $when, $then, $otherwise }, taskEngine, dataEngine) {
        this.taskEngine = taskEngine ? taskEngine : new TaskEngine();
        this.dataEngine = dataEngine ? dataEngine : new DataEngine();
        this.task = $perform ? this.taskEngine.registerTask($perform) : null;
        this.when = new Equation($when);
        this.then = $then ? new RuleEngine($then, taskEngine) : null;
        this.otherwise = $otherwise ? new RuleEngine($otherwise, taskEngine) : null;
    }
    registerData(collection, schema) {
        this.dataEngine.registerData(collection, schema);
    }
    runRuleBatch() {
        if (!_.isArray(dataList)) {
            dataList = [dataList];
        }
        if (dataList.length === 0) {
            return this.taskEngine;
        }
        if (!this.taskEngine.hasData) {
            this.taskEngine.registerData(dataList, idField);
        }
        if (!hasId) {
            dataList.map((data) => {
                if (!data[idField]) {
                    data[idField] = uuid();
                }
            });
        }
        if (this.task) {
            this.taskEngine.enque(this.task, dataList);
        }
        if (!this.when) {
            return this.taskEngine;
        }
        const thenDataList = [];
        const otherwiseDataList = [];
        dataList.forEach((data) => {
            if (this.when.evaluate(data)) {
                thenDataList.push(data);
            } else {
                otherwiseDataList.push(data);
            }
        });
        if (this.then) {
            this.then.runRuleBatch(thenDataList, true, idField);
        }
        if (this.otherwise) {
            this.otherwise.runRuleBatch(otherwiseDataList, true, idField);
        }
        return this.taskEngine;
    }
}

