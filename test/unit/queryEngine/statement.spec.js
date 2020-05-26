const Statement = require('../../../src/queryEngine/statement');
const { expect } = require('chai');

describe('Statement Class', () => {
    describe('Constructor', () => {
        it('Should create a simple Statement object', () => {
            const statement = new Statement('Field1', 10);
            expect(statement).to.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.operator).to.be.eql('$eq');
            expect(statement.value).to.be.eql(10);
        });
        it('Should create Statement with values as undefined', () => {
            const statement = new Statement('Field1');
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.operator).to.be.eql('$eq');
            expect(statement.value).to.be.eql(undefined);
        });
        it('Should create Statement with array of string', () => {
            try {
                new Statement('Field1', ['value1', 'value2']);
            } catch (e) {
                expect(e).to.be.eql('Array is not supported for \'$eq\' operator');
            }
        });
        it('Should create Statement with operator', () => {
            const statement = new Statement('Field1', { $in: ['value1', 'value2'] });
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.operator).to.be.eql('$in');
            expect(statement.values).to.be.eql(['value1', 'value2']);
        });
        it('Should create Statement with comparicon value as object', () => {
            const statement = new Statement('Field1', { otherRandomField: ['value1', 'value2'] });
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.operator).to.be.eql('$eq');
            expect(statement.value).to.be.eql({ otherRandomField: ['value1', 'value2'] });
        });
        it('Should create Statement with double operand operator', () => {
            const statement = new Statement('Field1', { $bt: ['value1', 'value2'] });
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.operator).to.be.eql('$bt');
            expect(statement.minValue).to.be.eql('value1');
            expect(statement.maxValue).to.be.eql('value2');
        });
        it('Should create Statement with double operand operator but single operand', () => {
            const statement = new Statement('Field1', { $bt: ['value1'] });
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.operator).to.be.eql('$bt');
            expect(statement.minValue).to.be.eql('value1');
            expect(statement.maxValue).to.be.eql('value1');
        });
        it('Should throw error if value is left blank', () => {
            try {
                new Statement('Field1', { $in: [] });
            } catch (e) {
                expect(e).to.be.eql('Only not empty Array is supported for \'$in\' operator');
            }
        });
    });
    describe('Evaluate', () => {
        it('Should evaluate for \'$eq\' operator', () => {
            const statement = new Statement('Field1', 10);
            expect(statement.evaluate({ Field1: 10 })).to.be.true;
            expect(statement.evaluate({ Field1: 11 })).to.be.false;
            const statement2 = new Statement('Field1', 'Value1');
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.true;
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.false;
        });
        it('Should evaluate for \'$ne\' operator', () => {
            const statement = new Statement('Field1', { $ne: 10 });
            expect(statement.evaluate({ Field1: 10 })).to.be.false;
            expect(statement.evaluate({ Field1: 11 })).to.be.true;
            const statement2 = new Statement('Field1', { $ne: 'Value1' });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.true;
        });
        it('Should evaluate for \'$lt\' operator', () => {
            const statement = new Statement('Field1', { $lt: 10 });
            expect(statement.evaluate({ Field1: 10 })).to.be.false;
            expect(statement.evaluate({ Field1: 9 })).to.be.true;
            expect(statement.evaluate({ Field1: 11 })).to.be.false;
            const statement2 = new Statement('Field1', { $lt: 'Value1' });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value0' })).to.be.true; // less than 'Value1' in dictionary order
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.false;
        });
        it('Should evaluate for \'$le\' operator', () => {
            const statement = new Statement('Field1', { $le: 10 });
            expect(statement.evaluate({ Field1: 10 })).to.be.true;
            expect(statement.evaluate({ Field1: 9 })).to.be.true;
            expect(statement.evaluate({ Field1: 11 })).to.be.false;
            const statement2 = new Statement('Field1', { $le: 'Value1' });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.true;
            expect(statement2.evaluate({ Field1: 'Value0' })).to.be.true; // less than 'Value1' in dictionary order
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.false;
        });
        it('Should evaluate for \'$gt\' operator', () => {
            const statement = new Statement('Field1', { $gt: 10 });
            expect(statement.evaluate({ Field1: 10 })).to.be.false;
            expect(statement.evaluate({ Field1: 9 })).to.be.false;
            expect(statement.evaluate({ Field1: 11 })).to.be.true;
            const statement2 = new Statement('Field1', { $gt: 'Value1' });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value0' })).to.be.false; // less than 'Value1' in dictionary order
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.true;
        });
        it('Should evaluate for \'$ge\' operator', () => {
            const statement = new Statement('Field1', { $ge: 10 });
            expect(statement.evaluate({ Field1: 10 })).to.be.true;
            expect(statement.evaluate({ Field1: 9 })).to.be.false;
            expect(statement.evaluate({ Field1: 11 })).to.be.true;
            const statement2 = new Statement('Field1', { $ge: 'Value1' });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.true;
            expect(statement2.evaluate({ Field1: 'Value0' })).to.be.false; // less than 'Value1' in dictionary order
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.true;
        });
        it('Should evaluate for \'$bt\' operator', () => {
            const statement = new Statement('Field1', { $bt: [10, 20] });
            expect(statement.evaluate({ Field1: 10 })).to.be.true;
            expect(statement.evaluate({ Field1: 9 })).to.be.false;
            expect(statement.evaluate({ Field1: 11 })).to.be.true;
            const statement2 = new Statement('Field1', { $bt: ['Value1', 'Value9'] });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.true;
            expect(statement2.evaluate({ Field1: 'Value0' })).to.be.false; // less than 'Value1' in dictionary order
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.true;
        });
        it('Should evaluate for \'$nb\' operator', () => {
            const statement = new Statement('Field1', { $nb: [10, 20] });
            expect(statement.evaluate({ Field1: 10 })).to.be.false;
            expect(statement.evaluate({ Field1: 9 })).to.be.true;
            expect(statement.evaluate({ Field1: 11 })).to.be.false;
            expect(statement.evaluate({ Field1: 20 })).to.be.false;
            expect(statement.evaluate({ Field1: 21 })).to.be.true;
            const statement2 = new Statement('Field1', { $nb: ['Value1', 'Value8'] });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value0' })).to.be.true; // less than 'Value1' in dictionary order
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value8' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value9' })).to.be.true;
        });
        it('Should evaluate for \'$in\' operator', () => {
            const statement = new Statement('Field1', { $in: [10, 31, 20] });
            expect(statement.evaluate({ Field1: 10 })).to.be.true;
            expect(statement.evaluate({ Field1: 9 })).to.be.false;
            expect(statement.evaluate({ Field1: 11 })).to.be.false;
            expect(statement.evaluate({ Field1: 20 })).to.be.true;
            expect(statement.evaluate({ Field1: 31 })).to.be.true;
            const statement2 = new Statement('Field1', { $in: ['Value1', 'Value8', 'X'] });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.true;
            expect(statement2.evaluate({ Field1: 'X' })).to.be.true;
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value8' })).to.be.true;
        });
        it('Should evaluate for \'$ni\' operator', () => {
            const statement = new Statement('Field1', { $ni: [10, 31, 20] });
            expect(statement.evaluate({ Field1: 10 })).to.be.false;
            expect(statement.evaluate({ Field1: 9 })).to.be.true;
            expect(statement.evaluate({ Field1: 11 })).to.be.true;
            expect(statement.evaluate({ Field1: 20 })).to.be.false;
            expect(statement.evaluate({ Field1: 31 })).to.be.false;
            const statement2 = new Statement('Field1', { $ni: ['Value1', 'Value8', 'X'] });
            expect(statement2.evaluate({ Field1: 'Value1' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'X' })).to.be.false;
            expect(statement2.evaluate({ Field1: 'Value2' })).to.be.true;
            expect(statement2.evaluate({ Field1: 'Value8' })).to.be.false;
        });
        it('Should evaluate for \'$ia\' operator', () => {
            const statement = new Statement('Field1', { $ia: [10, 31, 20] });
            expect(statement.evaluate({ Field1: [10, 31, 20] })).to.be.true;
            expect(statement.evaluate({ Field1: [10, 55, 31, 20] })).to.be.true;
            expect(statement.evaluate({ Field1: [10, 31, 21] })).to.be.false;
            expect(statement.evaluate({ Field1: [10, 31] })).to.be.false;
            const statement2 = new Statement('Field1', { $ia: ['Value1', 'Value8', 'X'] });
            expect(statement2.evaluate({ Field1: ['Value1', 'Value8', 'X'] })).to.be.true;
            expect(statement2.evaluate({ Field1: ['Value1', 'Y', 'Value8', 'X'] })).to.be.true;
            expect(statement2.evaluate({ Field1: ['Value1', 'Y', 'Value8'] })).to.be.false;
        });
        it('Should evaluate for \'$ea\' operator', () => {
            const statement = new Statement('Field1', { $ea: [10, 31, 20] });
            expect(statement.evaluate({ Field1: [10, 31, 20] })).to.be.false;
            expect(statement.evaluate({ Field1: [10, 55, 31, 20] })).to.be.false;
            expect(statement.evaluate({ Field1: [10, 31, 21] })).to.be.false;
            expect(statement.evaluate({ Field1: [10, 31] })).to.be.false;
            expect(statement.evaluate({ Field1: [110, 30] })).to.be.true;
            const statement2 = new Statement('Field1', { $ea: ['Value1', 'Value8', 'X'] });
            expect(statement2.evaluate({ Field1: ['Value1', 'Value8', 'X'] })).to.be.false;
            expect(statement2.evaluate({ Field1: ['Value1', 'Y', 'Value8', 'X'] })).to.be.false;
            expect(statement2.evaluate({ Field1: ['Value1', 'Y', 'Value8'] })).to.be.false;
            expect(statement2.evaluate({ Field1: ['ValueX', 'Y', 'Value7'] })).to.be.true;
        });
        it('Should evaluate for \'$ip\' operator', () => {
            const statement = new Statement('Field1', { $ip: [10, 31, 20] });
            expect(statement.evaluate({ Field1: [10, 31, 20] })).to.be.true;
            expect(statement.evaluate({ Field1: [10, 55, 31, 20] })).to.be.true;
            expect(statement.evaluate({ Field1: [10, 31, 21] })).to.be.true;
            expect(statement.evaluate({ Field1: [10, 31] })).to.be.true;
            expect(statement.evaluate({ Field1: [110, 30] })).to.be.false;
            const statement2 = new Statement('Field1', { $ip: ['Value1', 'Value8', 'X'] });
            expect(statement2.evaluate({ Field1: ['Value1', 'Value8', 'X'] })).to.be.true;
            expect(statement2.evaluate({ Field1: ['Value1', 'Y', 'Value8', 'X'] })).to.be.true;
            expect(statement2.evaluate({ Field1: ['Value1', 'Y', 'Value8'] })).to.be.true;
            expect(statement2.evaluate({ Field1: ['ValueX', 'Y', 'Value7'] })).to.be.false;
        });
    });
    describe('Negetive cases', () => {
        it('Multiple operator should take only first key', () => {
            const statement = new Statement('Field1', {
                $ip: [10, 31, 20],
                $gt: 56
            });
            expect(statement.operator).to.be.eql('$ip');
        });
    });
});

