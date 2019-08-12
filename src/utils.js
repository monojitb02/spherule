'use strict';
const runParalleOnList = async (list = [], cb) => {
    return await Promise.all(list.map(cb));
}
const addToList = async (list, items, cb) => {
    if (!items) {
        return;
    }
    if (Array.isArray(items)) {
        list.push(...$task.map(cb));
    } else {
        list.push(cb(items));
    }
}
module.exports = { runParalleOnList, addToList }