const _ = require('lodash');
const Statement = require('./statement');
module.exports = class Equation {
    constructor(equation) {
        const {
            $and = [],
            $or = [],
            $not,
            ...keyValues = {}
        } = this.validate(equation);
        this.and = [];
        this.or = [];
        if ($and.length) {
            this.and = $and.map(subEq => new Equation(subEq));
        }
        if ($or.length) {
            this.or = $or.map(subEq => new Equation(subEq));
        }
        if ($not) {
            this.not = new Equation($not);
        }
        if (!_.isEmpty(keyValues)) {
            _.map(keyValues, (value, key) => {
                this.and.push(new Statement(key, value));
            });
        }
    }
    validate(equation) {
        const { $and, $or, $not, ...keyValues } = equation;
        const isAnd = ($and !== undefined);
        const isOr = ($or !== undefined);
        const isNot = ($not !== undefined);
        const isKeyValues = (keyValues !== undefined);
        
        if (isAnd && !_.isArray($and)) { throw '$and in not an array'; }
        if (isOr &&!_.isArray($or)) { throw '$or in not an array'; }
        if (isNot &&!_.isPlainObject($not)) { throw '$not in not an plain Object'; }

        if ([isAnd, isOr, isNot].filter(e => e).length > 1) {
            throw 'Any one of $and, $or, $not can be used at the same level at a time.';
        }
        if (isKeyValues && isOr) {
            throw '$or is not valid in this context. Try in a nested level.';
        }
        if (isKeyValues && isNot) {
            throw '$not is not valid in this context. Try in a nested level.';
        }
        if(_.isEmpty($not)){
            $not = undefined;
        }
        return { $and, $or, $not, ...keyValues };
    }

    evaluate(data) {
        if (this.and.length) {
            return this.and.map(equation => equation.evaluate(data)).every(r => r);
        }
        if (this.or.length) {
            return this.or.map(equation => equation.evaluate(data)).some(r => r);
        }
        if (this.not) {
            return !this.not.evaluate(data);
        }
    }
}