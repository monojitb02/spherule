'use strict';
const DataPoint = require('./dataPoint');
class DataEngine {
    constructor() {
        this.dataSources = {};
    }
    register(collection, schema, options) {
        const { isDefault } = options;
        const newDataSource = new DataPoint({ collection, schema });
        if (isDefault) {
            this.dataSources.default = newDataSource;
        }
        this.dataSources[newDataSource._id] = newDataSource;
    }
    async getDataPoint(dataSourceId) {
        let dataSource;
        if (!dataSourceId) {
            if (!this.dataSources.default) {
                throw new Error('Rule engine does not have any default data to run on');
            }
            dataSource = this.dataSources.default;
        } else {
            dataSource = this.dataSources[dataSourceId];
        }
        await dataSource.transform();
        return dataSource;
    }
}
module.exports = DataEngine;