'use strict';
exports.runParalleOnList = async (list = [], cb) => {
    return await Promise.all(list.map(cb));
}
exports.addToList = async (list, items, cb) => {
    if (!items) {
        return;
    }
    if (Array.isArray(items)) {
        list.push(...items.map(cb));
    } else {
        list.push(cb(items));
    }
}