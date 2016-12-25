(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.router = factory());
}(this, (function() {
    'use strict';

    return {
        "/": "./scripts/app/index/index",
        "task": "./scripts/app/task/task"
    };
})))