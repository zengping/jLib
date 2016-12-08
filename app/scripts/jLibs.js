define(function() {
    //ajax
    function ajax(url, params, callback, method) {
        var self = this;
        xhr(method, url, function(data) {
            var result = JSON.parse(data);
            var code = result.status.code;
            var message = result.status.message;
            if (code !== 200) {
                alert("<p>异常信息：</p><p>" + message + "</p>");
                return;
            } else {
                callback(result.data);
            }
        });
    }

    function load(url) {
        var self = this;
        jLoad.xhr('GET', url, function(data) {
            self.innerHTML = data;

            jLoad.createJS(data);
        });
    }

    function xhr(method, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (callback) {
                    callback(xhr.responseText);
                }
            }
        };
    }

    function runJS(str) {
        var f = new Function(str);
        f();

        bindData(data);
    };

    function bindData(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        // 取出所有属性遍历
        Object.keys(data).forEach(function(key) {
            defineReactive(data, key, data[key]);
        });
    }

    function defineReactive(data, key, val) {
        bindData(val); // 监听子属性
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                return val;
            },
            set: function(newVal) {
                console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
                val = newVal;
            }
        });
    }

    function router(obj) {
        var appView = document.querySelector(obj.el);
        if (("onhashchange" in window) && ((typeof document.documentMode === "undefined") || document.documentMode == 8)) {

            window.onhashchange = function() {
                var url = window.location.href;
                var url_arr = url.match(/index\.html\#(.*?)$/);
                var viewUrl = url_arr ? url_arr[1] : "";
                if (!viewUrl) {
                    viewUrl = "index/index";
                }
                require(["./scripts/app/" + viewUrl], function(mod) {
                    appView.innerHTML = mod.template;

                    runJS(mod.script);
                });
            };
            onhashchange();
        }
    }

    return function(obj) {
        router(obj);
    };
});