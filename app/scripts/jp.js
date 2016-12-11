/*!
 * jp.js v0.0.1
 * (c) 2016 zengping
 * Released under the MIT License.
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.jp = factory());
}(this, (function() {
    'use strict';
    //mvvm
    function jp(opts) {
        var self = this;
        this.$opts = opts;
        var data = self._data = this.$opts.data;

        // 数据代理
        // 实现 jp.xxx -> jp._data.xxx
        Object.keys(data).forEach(function(key) {
            self._proxy(key);
        });

        observe(data, self);

        self.$compile = new Compile(opts.el || document.body, self);
    }

    jp.prototype = {
        $watch: function(key, cb, opts) {
            new Watcher(this, key, cb);
        },

        _proxy: function(key) {
            var self = this;
            Object.defineProperty(self, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return self._data[key];
                },
                set: function proxySetter(newVal) {
                    self._data[key] = newVal;
                }
            });
        }
    };

    // router
    function router(opts) {
        var appView = document.querySelector(opts.el);
        var router = opts.router;
        if (("onhashchange" in window) && ((typeof document.documentMode === "undefined") || document.documentMode == 8)) {

            window.onhashchange = function() {
                var url = window.location.href;
                var url_arr = url.match(/index\.html\#(.*?)$/);
                var viewUrl = url_arr ? url_arr[1] : "";
                if (!viewUrl) {
                    viewUrl = "/";
                }
                if (router[viewUrl] == undefined) {
                    console.log(viewUrl + " for router config is undefined!");
                }
                require([router[viewUrl]], function(mod) {
                    appView.innerHTML = mod.tmpl;
                    runJS(mod.script);
                });
            };
            onhashchange();
        }
    }

    function runJS(str) {
        var f = new Function(str);
        var opts = f();

        if (opts.methods) {
            opts.data.$get = $get;
            opts.methods.init && opts.methods.init.call(opts.data);
        }
        if (opts) {
            new jp(opts);
        }
    };

    // observer
    function Observer(data) {
        var self = this;
        self.data = data;
        self.walk(data);
    }

    Observer.prototype = {
        walk: function(data) {
            var self = this;
            Object.keys(data).forEach(function(key) {
                self.convert(key, data[key]);
            });
        },
        convert: function(key, val) {
            this.defineReactive(this.data, key, val);
        },

        defineReactive: function(data, key, val) {
            var dep = new Dep();
            var childObj = observe(val);

            Object.defineProperty(data, key, {
                enumerable: true, // 可枚举
                configurable: false, // 不能再define
                get: function() {
                    if (Dep.target) {
                        dep.depend();
                    }
                    return val;
                },
                set: function(newVal) {
                    if (newVal === val) {
                        return;
                    }
                    val = newVal;
                    // 新的值是object的话，进行监听
                    childObj = observe(newVal);
                    // 通知订阅者
                    dep.notify();
                }
            });
        }
    };

    function observe(value, jp) {
        if (!value || typeof value !== 'object') {
            return;
        }

        return new Observer(value);
    };


    var uid = 0;

    function Dep() {
        this.id = uid++;
        this.subs = [];
    }

    Dep.prototype = {
        addSub: function(sub) {
            this.subs.push(sub);
        },

        depend: function() {
            Dep.target.addDep(this);
        },

        removeSub: function(sub) {
            var index = this.subs.indexOf(sub);
            if (index != -1) {
                this.subs.splice(index, 1);
            }
        },

        notify: function() {
            this.subs.forEach(function(sub) {
                sub.update();
            });
        }
    };

    Dep.target = null;

    // compile
    function Compile(el, jp) {
        this.$jp = jp;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.init();
            this.$el.appendChild(this.$fragment);
        }
    }

    Compile.prototype = {
        node2Fragment: function(el) {
            var fragment = document.createDocumentFragment(),
                child;

            // 将原生节点拷贝到fragment
            while (child = el.firstChild) {
                fragment.appendChild(child);
            }

            return fragment;
        },

        init: function() {
            this.compileElement(this.$fragment);
        },

        compileElement: function(el) {
            var childNodes = el.childNodes,
                self = this;

            [].slice.call(childNodes).forEach(function(node) {
                var text = node.textContent;
                var reg = /\{\{(.*)\}\}/;

                if (self.isElementNode(node)) {
                    self.compile(node);

                } else if (self.isTextNode(node) && reg.test(text)) {
                    self.compileText(node, RegExp.$1);
                }

                if (node.childNodes && node.childNodes.length) {
                    self.compileElement(node);
                }
            });
        },

        compile: function(node) {
            var nodeAttrs = node.attributes,
                self = this;

            [].slice.call(nodeAttrs).forEach(function(attr) {
                var attrName = attr.name;
                if (self.isDirective(attrName)) {
                    var exp = attr.value;
                    var dir = attrName.substring(2);
                    // 事件指令
                    if (self.isEventDirective(dir)) {
                        compileUtil.eventHandler(node, self.$jp, exp, dir);
                        // 普通指令
                    } else {
                        compileUtil[dir] && compileUtil[dir](node, self.$jp, exp);
                    }

                    node.removeAttribute(attrName);
                }
            });
        },

        compileText: function(node, exp) {
            compileUtil.text(node, this.$jp, exp);
        },

        isDirective: function(attr) {
            return attr.indexOf('j-') == 0;
        },

        isEventDirective: function(dir) {
            return dir.indexOf('on') === 0;
        },

        isElementNode: function(node) {
            return node.nodeType == 1;
        },

        isTextNode: function(node) {
            return node.nodeType == 3;
        }
    };

    // 指令处理集合
    var compileUtil = {
        text: function(node, jp, exp) {
            this.bind(node, jp, exp, 'text');
        },

        html: function(node, jp, exp) {
            this.bind(node, jp, exp, 'html');
        },

        model: function(node, jp, exp) {
            this.bind(node, jp, exp, 'model');

            var me = this,
                val = this._getVMVal(jp, exp);
            node.addEventListener('input', function(e) {
                var newValue = e.target.value;
                if (val === newValue) {
                    return;
                }

                me._setVMVal(jp, exp, newValue);
                val = newValue;
            });
        },

        class: function(node, jp, exp) {
            this.bind(node, jp, exp, 'class');
        },

        for: function(node, jp, exp) {
            var index = exp.lastIndexOf(" ");
            var dir = exp.substr(index + 1);
            this.bind(node, jp, dir, 'for');
        },

        bind: function(node, jp, exp, dir) {
            var updaterFn = updater[dir + 'Updater'];

            updaterFn && updaterFn(node, this._getVMVal(jp, exp));

            new Watcher(jp, exp, function(value, oldValue) {
                updaterFn && updaterFn(node, value, oldValue);
            });
        },

        // 事件处理
        eventHandler: function(node, jp, exp, dir) {
            var eventType = dir.split(':')[1],
                fn = jp.$opts.methods && jp.$opts.methods[exp];

            if (eventType && fn) {
                node.addEventListener(eventType, fn.bind(jp), false);
            }
        },

        _getVMVal: function(jp, exp) {
            var val = jp._data;
            exp = exp.split('.');
            exp.forEach(function(k) {
                val = val[k];
            });
            return val;
        },

        _setVMVal: function(jp, exp, value) {
            var val = jp._data;
            exp = exp.split('.');
            exp.forEach(function(k, i) {
                // 非最后一个key，更新val的值
                if (i < exp.length - 1) {
                    val = val[k];
                } else {
                    val[k] = value;
                }
            });
        }
    };


    var updater = {
        textUpdater: function(node, value) {
            node.textContent = typeof value == 'undefined' ? '' : value;
        },

        htmlUpdater: function(node, value) {
            node.innerHTML = typeof value == 'undefined' ? '' : value;
        },

        classUpdater: function(node, value, oldValue) {
            var className = node.className;
            className = className.replace(oldValue, '').replace(/\s$/, '');

            var space = className && String(value) ? ' ' : '';

            node.className = className + space + value;
        },

        forUpdater: function(node, value) {
            console.log(value);
            var className = node.className;
            className = className.replace(oldValue, '').replace(/\s$/, '');

            var space = className && String(value) ? ' ' : '';

            node.className = className + space + value;
        },

        modelUpdater: function(node, value, oldValue) {
            node.value = typeof value == 'undefined' ? '' : value;
        }
    };

    // watcher
    function Watcher(jp, exp, cb) {
        this.cb = cb;
        this.jp = jp;
        this.exp = exp;
        this.depIds = {};
        this.value = this.get();
    }

    Watcher.prototype = {
        update: function() {
            this.run();
        },
        run: function() {
            var value = this.get();
            var oldVal = this.value;
            if (value !== oldVal) {
                this.value = value;
                this.cb.call(this.jp, value, oldVal);
            }
        },
        addDep: function(dep) {
            if (!this.depIds.hasOwnProperty(dep.id)) {
                dep.addSub(this);
                this.depIds[dep.id] = dep;
            }
        },
        get: function() {
            Dep.target = this;
            var value = this.getVMVal();
            Dep.target = null;
            return value;
        },

        getVMVal: function() {
            var exp = this.exp.split('.');
            var val = this.jp._data;
            exp.forEach(function(k) {
                val = val[k];
            });
            return val;
        }
    };

    function loadComponents(opts) {
        var appView = document.querySelector(opts.el);
        require([opts.components], function(mod) {
            appView.innerHTML = mod.tmpl;
            runJS(mod.script);
        });
    }

    function xhr(method, url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function() {
                if (xhr.status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(Error(xhr.statusText));
                }
            };
            xhr.onerror = function() {
                reject(Error("Network Error"));
            };
            xhr.send();
            // xhr.onreadystatechange = function() {
            //     if (xhr.readyState == 4 && xhr.status == 200) {
            //         if (callback) {
            //             callback(JSON.parse(xhr.responseText));
            //         }
            //         resolve(JSON.parse(xhr.responseText));
            //     } else {
            //         console.log(xhr.statusText);
            //         reject(Error(xhr.statusText));
            //     }
            // };
        });
    }

    function $http(method, url) {
        return new Promise(function(resolve, reject) {
            xhr(method, url).then(function(res) {
                var data = JSON.parse(res);
                if (data.status.code == 200) {
                    resolve(data.data);
                } else {
                    reject(Error(data.status.message));
                }
            }, function(err) {
                console.error("Failed!", err);
            });
        });
    }

    function $get(url) {
        return new Promise(function(resolve, reject) {
            $http("GET", url).then(function(res) {
                resolve(res);
            }, function(err) {
                console.error("Failed!", err);
            });
        });
    }

    function main(opts) {
        if (opts.router == undefined) {
            if (opts.components) {
                loadComponents(opts);
            }
            return;
        }
        router(opts);
    }

    return main;
})));