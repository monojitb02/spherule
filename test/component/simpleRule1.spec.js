'use strict';
const { RuleEngine } = require('../../index');
const fn = (datas) => {
    datas.map(data => {
        console.log('hello', data.name);
    });
}
const fn2 = (datas) => {
    datas.map(data => {
        console.log('Bye', data.name);
    });
}
const fni = (data) => {
    console.log('hello', data.name);
}
const fn2i = (data) => {
    console.log('Bye', data.name);
}
const start = new Date();
const ruleEngine = new RuleEngine({
    $when: {
        name: { $in: [null, undefined] }
    },
    $then: {
        $task: fn
    },
    $otherwise: {
        $task: fn2
    }
});
const runner = async () => {
    const running = new Date();
    await ruleEngine.run({
        collection: [{
            id: 1,
        }, {
            id: 2,
            name: 'Vikash'
        }],
        schema: {}
    }, { inBatch: true });
    const rulesApplied = new Date();
    console.log(running - start);
    console.log(rulesApplied - running);
    ruleEngine.taskEngine.runAllTasks({ filteredOnly: true });
}
runner();