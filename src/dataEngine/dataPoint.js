'use strict';
const _ = require('lodash');
const uuid = require('uuid/v4');
module.exports = class DataPoint {
    constructor(collection, schema, options) {
        const { isTransformed } = options;
        this._id = uuid();
        this.rawData = collection;
        this.schema = schema;
        this.ids = [];
        this.index = {};
        if (isTransformed) {
            this.data = this.rawData;
        }
    }
    getById(id) {
        const index = this.index[id];
        return this.data[index];
    }
    getByIds(ids) {
        const indices = _.pick(this.index, ids);
        return _.values(indices).map(index => this.data[index]);
    }
    async buildIndex(idField) {
        this.data.forEach((data, index) => {
            const id = data[idField]
            this.index[id] = index;
            this.ids.push(id);
        });
        return;
    }
    async transform() {
        if (this.data) {
            return this;
        }
        this.data = this.rawData;
        //TODO: add schema validation and transformation
        //TODO: add indexing based on schema deffinition
        await this.buildIndex('id');
        return this;
    }
}