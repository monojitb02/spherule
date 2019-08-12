'use strict';
const Ajv = require('ajv');
const _ = require('lodash');
const uuid = require('uuid/v4');
module.exports = class DataPoint {
    //TODO: Support rules to validate on aditional data sources
    //TODO: Add in memory data layer and bulk update call for that data source at the end
    constructor({ collection, schema }) {
        this._id = uuid();
        this.rawData = collection;
        this.schema = {
            $async: true,
            ...schema
        };
        this.ids = [];
        this.index = {};
        const ajv = new Ajv({ coerceTypes: 'array', removeAdditional: true })
        this.validate = ajv.compile(this.schema)
        this.keyField = this.schema.uniqueItemProperty || 'id'
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
            let id = _.get(data, idField);
            if (!id) {
                id = uuid();
                _.set(data, idField, id);
            }
            this.index[id] = index;
            this.ids.push(id);
        });
        return;
    }
    async transform() {
        if (this.data) {
            return this;
        }
        if (this.schema.isTransformed) {
            this.data = this.rawData;
        } else {
            try {
                this.data = await this.validate(_.cloneDeep(this.rawData));
            } catch (e) {
                console.log('Failure in transformation', e);
                throw 'Data Transformation failed!!!';
            }
        }
        await this.buildIndex(this.keyField);
        return this;
    }
}