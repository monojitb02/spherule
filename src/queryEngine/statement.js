'use strict';
const _ = require('lodash');
const singleOperandComparators = ['$eq', '$!eq', '$ne', '$gt', '$lt', '$ge', '$le'];
const doubleOperandComparators = ['$bt', '$!bt', '$nb'];
const multiOperandComparators = ['$in', '$!in', '$ni', '$ip', '$!ea', '$ia', '$ea'];
const OP = [
    ...singleOperandComparators,
    ...doubleOperandComparators,
    ...multiOperandComparators
];
module.exports = class Statement {
    //TODO: support schema of the field so that it can be migrated to typed language like go
    constructor(field, values) {
        this.field = field;
        this.validate(values);
        this.generateEvalutor();
    }
    validate(values) {
        this.comparator = '$eq';
        if (_.isPlainObject(values)) {
            // multiple comparator on same field is not supported yet
            const comparator = _.chain(values).keys().intersection(OP).head().value();
            if (comparator) {
                this.comparator = comparator;
                values = values[this.comparator];
            }
        }
        this.isArray = _.isArray(values);
        this.isPlainObject = _.isPlainObject(values);
        this.isSingleOperandComparators = _.includes(singleOperandComparators, this.comparator);
        this.isDoubleOperandComparators = _.includes(doubleOperandComparators, this.comparator);
        this.isMultiOperandComparators = _.includes(multiOperandComparators, this.comparator);
        if (this.isSingleOperandComparators && this.isArray) {
            throw `Array is not supported for '${this.comparator}' operator`;
        }
        if (!this.isSingleOperandComparators && !values.length) {
            throw `Only not empty Array is supported for '${this.comparator}' operator`;
        }
        if (this.isSingleOperandComparators) {
            this.value = values;
            return;
        }
        if (this.isDoubleOperandComparators) {
            this.minValue = values[0];
            this.maxValue = values[1] || values[0];
            return;
        }
        this.values = values;
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
            case '$!eq':
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
            case '$!bt':
                this.evaluator = (data) => data < this.minValue || data > this.maxValue;
                break;
            case '$in': // in
                this.evaluator = (data) => _.includes(this.values, data);
                break;
            case '$ni': // not in
            case '$!in':
                this.evaluator = (data) => !_.includes(this.values, data);
                break;
            case '$ia': // include all
                this.evaluator = (data) => _.intersection(this.values, data).length === this.values.length;
                break;
            case '$ea': // exclude all
                this.evaluator = (data) => _.intersection(this.values, data).length === 0;
                break;
            case '$ip': // includes partially
            case '$!ea':
                this.evaluator = (data) => _.intersection(this.values, data).length > 0;
                break;
            default: // default equal. It will never come here
                this.evaluator = (data) => data === this.value;
        }
    }
}