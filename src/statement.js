'use strict';
const _ = require('lodash');
const OP = ['$eq', '$ne', '$gt', '$lt', '$ge', '$le', '$bt', '$nb', '$in', '$ni', '$ia', '$ea'];
module.exports = class Statement {
    constructor(field, values) {
        this.field = field;
        this.comparator = '$eq';
        this.values = values;
        if (_.isPlainObject(values)) {
            const comparator = _.chain(values).keys().intersection(OP).head().value();
            if (comparator) {
                this.comparator = comparator;
                this.values = values[comparator];
            }
        }
        if (!_.isArray(this.values)) {
            this.values = [this.values];
        }
        if (_.isEmpty(this.values)) {
            throw `Values cannot be left blank in a statement for ${field}`;
        }
    }
    evaluate(data) {
        let result;
        switch (this.comparator) {
            case '$eq':
                result = data[this.field] === this.values[0];
                break;
            case '$ne':
                result = data[this.field] !== this.values[0];
                break;
            case '$gt':
                result = data[this.field] > this.values[0];
                break;
            case '$lt':
                result = data[this.field] < this.values[0];
                break;
            case '$ge':
                result = data[this.field] >= this.values[0];
                break;
            case '$le':
                result = data[this.field] <= this.values[0];
                break;
            case '$bt': // between
                if (this.values.length === 1) {
                    result = data[this.field] === this.values[0];
                } else {
                    result = data[this.field] >= this.values[0] &&
                        data[this.field] <= this.values[1];
                }
                break;
            case '$nb': // not between
                if (this.values.length === 1) {
                    result = data[this.field] !== this.values[0];
                } else {
                    result = data[this.field] < this.values[0] ||
                        data[this.field] > this.values[1];
                }
                break;
            case '$in': // in
                result = _.includes(this.values, data[this.field]);
                break;
            case '$ni': // not in
                result = !_.includes(this.values, data[this.field]);
                break;
            case '$ia': // include all
                result = _.intersection(this.values, data[this.field]).length === this.values;
                break;
            case '$ea': // exclude all
                result = _.intersection(this.values, data[this.field]).length === 0;
                break;
            default: // default equal
                result = data[this.field] === this.values[0];
        }
        return result;
    }
}