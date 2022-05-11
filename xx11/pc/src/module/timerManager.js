/**
 * Author: Fay(tigertop001@gmail.com)
 * Date: 2020/2/4
 * Last Modified by: Fay
 * Copyright (c) 2020, HuaSheng, Inc.
 * Description: 系统计时器管理
 */
let ins = null;

class TimerManager {
    constructor() {
        if (ins) {
            return ins;
        }
        this.setTimeoutQueue = [];
        this.timeWorker = {};
        ins = this;
    }

    addSetTimeout(id, cb) {
        if (!this.setTimeoutQueue.filter(item => item.id === id).length) {
            this.setTimeoutQueue.push({id, cb});
        }
        return this;
    }

    delSetTimeout(id) {
        this.setTimeoutQueue = this.setTimeoutQueue.filter(item => item.id !== id);
    }

    startSetTimout(id, time = 1000) {
        const _this = this;
        let currentSetTimeout = this.setTimeoutQueue.filter(item => item.id === id)[0];
        if (!currentSetTimeout) {
            return false;
        }
        let execute = function (fn) {
            _this.timeWorker[id] && clearTimeout(_this.timeWorker[id])
            _this.timeWorker[id] = setTimeout(function () {
                fn();
                if (!_this.timeWorker[id]) return
                execute(fn);
            }, time);
        };
        execute(currentSetTimeout.cb);
    }

    stopSetTimeout(id) {
        if (!id) {
            this.setTimeoutQueue = [];
            for (let i in this.timeWorker) {
                clearTimeout(this.timeWorker[i]);
                delete this.timeWorker[i];
            }
            return this;
        }
        this.setTimeoutQueue = this.setTimeoutQueue.filter(item => item.id !== id);
        for (let i in this.timeWorker) {
            if (i === id) {
                clearTimeout(this.timeWorker[i]);
                delete this.timeWorker[i];
                break;
            }
        }
        return this;
    }
}

TimerManager.init = function () {
    return new TimerManager();
};

export default TimerManager;
