'use strict';
const { runParalleOnList, addToList } = require('./utils');
const Query = require('./queryEngine/query');
const TaskEngine = require('./taskEngine');
const DataEngine = require('./dataEngine');
class RuleEngine {
    /**
     * 
     * @param {*} rule 
     * @param {TaskEngine} taskEngine 
     * @param {DataEngine} dataEngine 
     */
    constructor({ $task, $when, $then, $otherwise }, taskEngine, dataEngine) {
        this.taskEngine = taskEngine ? taskEngine : new TaskEngine();
        this.dataEngine = dataEngine ? dataEngine : new DataEngine();
        this.tasks = [];
        this.when = null;
        this.then = [];
        this.otherwise = [];
        if ($when) {
            this.when = new Query($when);
        }
        addToList(this.tasks, $task, item => this.taskEngine.registerTask(item));
        addToList(this.then, $then, item => new RuleEngine(item, this.taskEngine, this.dataEngine));
        addToList(this.otherwise, $otherwise, item => new RuleEngine(item, this.taskEngine, this.dataEngine));
    }

    async registerDataSource(collection, schema) {
        return await this.dataEngine.register(collection, schema);
    }
    async run({ collection, schema, ids }, options) {
        const { inBatch } = options;
        if (collection && schema) {
            await this.dataEngine.register(collection, schema, { isDefault: true });
        }
        const dataPoint = await this.dataEngine.getDataPoint();
        const thenDataIds = [];
        const otherwiseDataIds = [];
        if (this.tasks.length && this.tasks.some(t => !t.hasData)) {
            await runParalleOnList(this.tasks, t => t.registerDataPoint(dataPoint));
        }
        if (!ids) {
            ids = dataPoint.ids;
        }

        await runParalleOnList(ids, async id => {
            if (this.tasks.length) {
                await runParalleOnList(this.tasks, async t => {
                    if (inBatch) {
                        return t.enque(id);
                    } else {
                        return await t.runImmidiate(id, options);
                    }
                });
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
        if (!this.when) {
            return;
        }
        const promisese = []
        if (this.then.length) {
            promisese.push(...this.then.map(re => re.run({ ids: thenDataIds }, options)));
        }
        if (this.otherwise.length) {
            promisese.push(...this.otherwise.map(re => re.run({ ids: otherwiseDataIds }, options)));
        }
        return await Promise.all(promisese);
    }
}

module.exports = RuleEngine;