'use strict';
const getStats = () => {
    // let used = process.memoryUsage();
    // for (let key in used) {
    //     console.log(`${key} ${Math.round(used[key] / 1024 * 100) / 100} KB`);
    // }
    // console.log('============================');
}
const data = require('./test2.json');
// const data = require('./citylots.json');
getStats();
const { RuleEngine } = require('../../index');
const fn = (datas) => {
    console.log('HIT', datas.length);
    // datas.map(data => {
    //     console.log('hello', data.properties.MAPBLKLOT);
    // });
}
const fn2 = (datas) => {
    console.log('MISS', datas.length);
    // datas.map(data => {
    //     console.log('Bye', data.geometry.type);
    // });
}
getStats();
const ruleEngine = new RuleEngine({
    $when: {
        'properties.ST_TYPE': 'AVE',
        // 'properties.STREET': 'UNKNOWN'
    },
    $then: {
        $task: fn
    },
    $otherwise: {
        $task: fn2
    }
});

getStats();
const runner = async () => {
    const collection = data.slice(0, 69);
    // const collection = data;

    let schema = {
        uniqueItemProperty: 'properties.MAPBLKLOT',
        items: {
            type: 'object',
            properties: {
                properties: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        MAPBLKLOT: { type: 'string' },
                        BLKLOT: { type: 'string' },
                        BLOCK_NUM: { type: 'string' },
                        LOT_NUM: { type: 'string' },
                        ST_TYPE: { type: 'string' },
                    }
                }
            }
        }
    };
    console.log(`Processing ${collection.length} records`);
    const running = new Date();
    await ruleEngine.run({
        collection,
        schema
    }, { inBatch: true });
    const rulesApplied = new Date();
    console.log(rulesApplied - running);
    getStats();
    await ruleEngine.taskEngine.runAllTasks({ filteredOnly: true });
}
runner();

getStats();