'use strict';
const _ = require('lodash');
// operators
const operatorMap = {
    '$eq': { operandCount: 1, evaluator: (data, context) => data === context.value },
    '$ne': { operandCount: 1, evaluator: (data, context) => data !== context.value },
    '$gt': { operandCount: 1, evaluator: (data, context) => data > context.value },
    '$lt': { operandCount: 1, evaluator: (data, context) => data < context.value },
    '$ge': { operandCount: 1, evaluator: (data, context) => data >= context.value },
    '$le': { operandCount: 1, evaluator: (data, context) => data <= context.value },
    '$bt': { operandCount: 2, evaluator: (data, context) => data >= context.minValue && data <= context.maxValue }, // between
    '$nb': { operandCount: 2, evaluator: (data, context) => data < context.minValue || data > context.maxValue }, // not between
    '$in': { operandCount: 0, evaluator: (data, context) => _.includes(context.values, data) },
    '$ni': { operandCount: 0, evaluator: (data, context) => !_.includes(context.values, data) }, // not in
    '$ia': { operandCount: 0, evaluator: (data, context) => _.intersection(context.values, data).length === context.values.length }, // include all
    '$!ia': { operandCount: 0, evaluator: (data, context) => _.intersection(context.values, data).length !== context.values.length }, // not include all
    '$ip': { operandCount: 0, evaluator: (data, context) => _.intersection(context.values, data).length > 0 }, // includes partially
    '$ea': { operandCount: 0, evaluator: (data, context) => _.intersection(context.values, data).length === 0 },  // exclude all
}
// aliases
operatorMap['$!eq'] = operatorMap['$ne'];
operatorMap['$!bt'] = operatorMap['$nb'];
operatorMap['$!in'] = operatorMap['$ni'];
const OP = _.keys(operatorMap);
module.exports = class Statement {
    //TODO: support schema of the field so that it can be migrated to typed language like go
    constructor(field, values) {
        this.field = field;
        this.validate(values);
        this.evaluator = operatorMap[this.operator].evaluator;
    }
    validate(values) {
        this.operator = '$eq';
        if (_.isPlainObject(values)) {
            // multiple operator on same field is not supported yet
            const operator = _.chain(values).keys().intersection(OP).head().value();
            if (operator) {
                this.operator = operator;
                values = values[this.operator];
            }
        }
        const operator = operatorMap[this.operator];
        if (operator.operandCount === 1 && _.isArray(values)) {
            throw `Array is not supported for '${this.operator}' operator`;
        }
        if (!operator.operandCount === 1 && !values.length) {
            throw `Only not empty Array is supported for '${this.operator}' operator`;
        }
        if (operator.operandCount === 1) {
            this.value = values;
            return;
        }
        if (operator.operandCount === 2) {
            this.minValue = values[0];
            this.maxValue = values[1] || values[0];
            return;
        }
        this.values = values;
    }
    evaluate(data) {
        const fieldData = _.get(data, this.field);
        return this.evaluator(fieldData, this);
    }
}