'use strict';
const Query = require('./queryEngine');
const TaskEngine = require('./taskEngine');
const DataEngine = require('./dataEngine');
module.exports = class RuleEngine {
    /**
     * 
     * @param {*} rule 
     * @param {TaskEngine} taskEngine 
     * @param {DataEngine} dataEngine 
     */
    constructor({ $task, $when, $then, $otherwise }, taskEngine, dataEngine) {
        this.taskEngine = taskEngine ? taskEngine : new TaskEngine();
        this.dataEngine = dataEngine ? dataEngine : new DataEngine();
        this.task = $task ? this.taskEngine.registerTask($task) : null;
        this.when = $when ? new Query($when) : null;
        this.then = $then ? new RuleEngine($then, this.taskEngine, this.dataEngine) : null;
        this.otherwise = $otherwise ? new RuleEngine($otherwise, this.taskEngine, this.dataEngine) : null;
    }
    async registerDataSource(collection, schema) {
        return await this.dataEngine.register(collection, schema);
    }
    async runBatch({ collection, schema, ids }) {
        if (collection && schema) {
            await this.dataEngine.register(collection, schema, { isDefault: true });
        }
        const dataPoint = await this.dataEngine.getDataPoint();
        const thenDataIds = [];
        const otherwiseDataIds = [];
        if (this.task && !this.task.hasData) {
            await this.task.registerDataPoint(dataPoint);
        }
        if (!ids) {
            ids = dataPoint.ids;
        }

        ids.forEach(id => {
            if (this.task) {
                this.task.enque(id);
            }
            if (!this.when) {
                return;
            }
            if (this.when.evaluate(dataPoint.getById(id))) {
                thenDataIds.push(id);
            } else {
                otherwiseDataIds.push(id);
            }
        });
        const promisese = []
        if (this.then) {
            promisese.push(this.then.runBatch({ ids: thenDataIds }));
        }
        if (this.otherwise) {
            promisese.push(this.otherwise.runBatch({ ids: otherwiseDataIds }));
        }
        return await Promise.all([promisese]);
    }
    async run({ collection, schema, ids }, options) {
        if (collection && schema) {
            await this.dataEngine.register(collection, schema, { isDefault: true });
        }
        const dataPoint = await this.dataEngine.getDataPoint();
        const thenDataIds = [];
        const otherwiseDataIds = [];
        if (this.task && !this.task.hasData) {
            await this.task.registerDataPoint(dataPoint);
        }
        if (!ids) {
            ids = dataPoint.ids;
        }

        ids.forEach(id => {
            if (this.task) {
                await this.task.runImmidiate(id, options);
            }
            if (!this.when) {
                return;
            }
            if (this.when.evaluate(dataPoint.getById(id))) {
                thenDataIds.push(id);
            } else {
                otherwiseDataIds.push(id);
            }
        });
        const promisese = []
        if (this.then) {
            promisese.push(this.then.run({ ids: thenDataIds }, options));
        }
        if (this.otherwise) {
            promisese.push(this.otherwise.run({ ids: otherwiseDataIds }, options));
        }
        return await Promise.all([promisese]);
    }
}