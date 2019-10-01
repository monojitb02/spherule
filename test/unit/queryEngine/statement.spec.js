const Statement = require('../../../src/queryEngine/statement');
const { expect } = require('chai');

describe('Statement Class', () => {
    describe('Constructor', () => {
        it('Should create a simple Statement object', () => {
            const statement = new Statement('Field1', 10);
            expect(statement).to.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.comparator).to.be.eql('$eq');
            expect(statement.values).to.be.eql([10]);
        });
        it('Should create Statement with values as undefined', () => {
            const statement = new Statement('Field1');
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.comparator).to.be.eql('$eq');
            expect(statement.values).to.be.eql([undefined]);
        });
        it('Should create Statement with array of string', () => {
            const statement = new Statement('Field1', ['value1', 'value2']);
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.comparator).to.be.eql('$eq');
            expect(statement.values).to.be.eql(['value1', 'value2']);
        });
        it('Should create Statement with comparator', () => {
            const statement = new Statement('Field1', { $in: ['value1', 'value2'] });
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.comparator).to.be.eql('$in');
            expect(statement.values).to.be.eql(['value1', 'value2']);
        });
        it('Should create Statement with comparicon value as object', () => {
            const statement = new Statement('Field1', { otherRandomField: ['value1', 'value2'] });
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.comparator).to.be.eql('$eq');
            expect(statement.values).to.be.eql([{ otherRandomField: ['value1', 'value2'] }]);
        });
        it('Should throw error if value is left blank', () => {
            const statement = new Statement('Field1', { otherRandomField: ['value1', 'value2'] });
            expect(statement).to.be.be.an.instanceof(Statement);
            expect(statement.field).to.be.eql('Field1');
            expect(statement.comparator).to.be.eql('$eq');
            expect(statement.values).to.be.eql([{ otherRandomField: ['value1', 'value2'] }]);
        });
    });
});

