'use strict';
const uuid = require('uuid/v4');
module.exports = class Task {
    constructor(task) {
        this._id = uuid();
        this.task = task;
        this.dataIds = [];
        this.dataPoint = null;
    }
    registerDataPoint(dataPoint) {
        this.hasData = true;
        this.dataPoint = dataPoint;
    }
    enque(dataIds) {
        this.dataIds.push(dataIds);
    }
    async run(options) {
        const { filteredOnly } = options;
        if (!this.hasData) {
            return;
        }
        if (filteredOnly) {
            return await this.task(this.dataPoint.getByIds(this.dataIds));
        } else {
            return await this.task(this.dataIds, this.dataPoint.data, this.dataPoint.rawData);
        }
    }
    async runImmidiate(id, options) {
        const { filteredOnly } = options;
        if (!this.hasData) {
            return;
        }
        if (filteredOnly) {
            return await this.task(this.dataPoint.getById(id));
        } else {
            return await this.task(id, this.dataPoint.data, this.dataPoint.rawData);
        }
    }
}