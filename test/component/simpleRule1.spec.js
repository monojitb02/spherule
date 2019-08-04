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
    await ruleEngine.runBatch({
        collection: [{
            id: 1,
        }, {
            id: 2,
            name: 'Vikash'
        }],
        schema: {}
    });
    ruleEngine.taskEngine.runAllTasks({ filteredOnly: true });
}
runner();