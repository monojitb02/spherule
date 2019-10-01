'use strict';
const _ = require('lodash');
const singleOperandComparators = ['$eq', '$ne', '$gt', '$lt', '$ge', '$le'];
const doubleOperandComparators = ['$bt', '$nb'];
const multiOperandComparators = ['$in', '$ni', '$ia', '$ea'];
const OP = [
    ...singleOperandComparators,
    ...doubleOperandComparators,
    ...multiOperandComparators
];
module.exports = class Statement {
    constructor(field, values) {
        this.field = field;
        this.comparator = '$eq';
        this.value = values;
        this.values = values;
        if (_.isPlainObject(values)) {
            // multiple comparator on same field is not supported yet
            const comparator = _.chain(values).keys().intersection(OP).head().value();
            if (comparator) {
                this.comparator = comparator;
                this.values = values[comparator];
            }
        }
        if (!Array.isArray(this.values)) {
            this.values = [this.values];
        }
        if (_.isEmpty(this.values)) {
            throw `Values cannot be left blank in a statement for ${field}`;
        }
        this.generateEvalutor();
    }
    evaluator(data) {
        return data === this.value;
    }
    evaluate(data) {
        const fieldData = _.get(data, this.field);
        return this.evaluator(fieldData);
    }
    generateEvalutor() {
        switch (this.comparator) {
            case '$eq':
                this.evaluator = (data) => data === this.value;
                break;
            case '$ne':
                this.evaluator = (data) => data !== this.value;
                break;
            case '$gt':
                this.evaluator = (data) => data > this.value;
                break;
            case '$lt':
                this.evaluator = (data) => data < this.value;
                break;
            case '$ge':
                this.evaluator = (data) => data >= this.value;
                break;
            case '$le':
                this.evaluator = (data) => data <= this.value;
                break;
            case '$bt': // between
                this.evaluator = (data) => data >= this.minValue && data <= this.maxValue;
                break;
            case '$nb': // not between
                this.evaluator = (data) => data < this.minValue && data > this.maxValue;
                break;
            case '$in': // in
                this.evaluator = (data) => _.includes(this.values, data);
                break;
            case '$ni': // not in
                this.evaluator = (data) => !_.includes(this.values, data);
                break;
            case '$ia': // include all
                this.evaluator = (data) => _.intersection(this.values, data).length === this.values.length;
                break;
            case '$ea': // exclude all
                this.evaluator = (data) => _.intersection(this.values, data).length === 0;
                break;
            default: // default equal
                this.evaluator = (data) => data === this.value;
        }
    }
}