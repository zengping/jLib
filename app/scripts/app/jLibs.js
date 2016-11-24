define(function() {
    // 发布，订阅者模式
    var topics = {};
    //发布消息
    function publish(topic, args) {
        if (!topics[topic]) {
            return;
        }
        topics[topic](topic, args);
        return this;
    };
    //订阅事件
    function subscribe(topic, func) {
        topics[topic] = topics[topic] ? topics[topic] : func;
        return true;
    };

    //模板引擎
    function tmpl(obj) {
        var str = document.querySelector("[j-view]");
        str = tmplCreateIf(str);
        str.innerHTML = str.innerHTML;
        tmplBindData(obj);
    }

    function tmplBindData(obj) {
        var str = document.querySelectorAll("[j-for]");
        if (str.length > 0) {
            for (var m = 0; m < str.length; m++) {
                var dc = str[m].getAttribute("j-for");
                if (!(new RegExp(obj.name, "g").test(dc))) {
                    break;
                }
                var hstr = str[m].outerHTML;
                var f = str[m].querySelectorAll("[j-for]");
                if (f.length > 0) {
                    for (var i = 0; i < f.length; i++) {
                        var ic = f[i].getAttribute("j-for");
                        var fc = ic.replace(/\(?(.*?)\)?\sin\s(.*?)/g, '$2');
                        var h = "";
                        h += "{{each " + ic + "}}";
                        h += f[i].outerHTML.replace(" j-for\=\"" + ic + "\"", "");
                        h += "{{/each}}";
                        hstr = hstr.replace(f[i].outerHTML, h);
                    }
                }
                hstr = "{{each " + dc + "}}" + hstr.replace(" j-for\=\"" + dc + "\"", "") + "{{/each}}";
                var vE = viewFunction(obj.name, hstr);
                var pstr = str[m].parentNode.innerHTML;
                str[m].parentNode.innerHTML = pstr.replace(str[m].outerHTML, vE(obj.data));
            }
        } else {
            var str = document.querySelector("[j-view]");
            var vE = viewFunction(obj.name, str.innerHTML);
            str.innerHTML = vE(obj.data);
        }
    }

    function cFor(str) {
        var f = str.querySelectorAll("[j-for]");
        var hstr = str.innerHTML;
        if (f.length > 0) {
            for (var i = 0; i < f.length; i++) {
                var ic = f[i].getAttribute("j-for");
                var fc = ic.replace(/\(?(.*?)\)?\sin\s(.*?)/g, '$2');
                var h = "";
                h += "<tr class=\"" + fc + "\" j-for=\"" + ic + "\">";
                h += f[i].outerHTML.replace("j-for\=\"" + ic + "\"", "");
                h += "</tr>";
                hstr = hstr.replace(f[i].outerHTML, h);
            }
        }
        str.innerHTML = hstr;
        return str;
    }

    function tmplCreateIf(str) {
        var f = str.querySelectorAll("[j-if]");
        var hstr = str.innerHTML;
        if (f.length > 0) {
            for (var i = 0; i < f.length; i++) {
                var ic = f[i].getAttribute("j-if");
                var h = "";
                h += "{{if " + ic + "}}";
                if ((new RegExp("\<span j\-if\=\"(.*?)\">", 'g')).test(f[i].outerHTML)) {
                    h += f[i].innerHTML;
                } else {
                    h += f[i].outerHTML.replace(" j-if\=\"" + ic + "\"", "");
                }
                h += "{{/if}}";
                hstr = hstr.replace((new RegExp(f[i].outerHTML, 'g')), h);
            }
        }
        str.innerHTML = hstr;
        return str;
    }

    function viewFunction(list, str) {
        return new Function(list,
            'var arr = [];' +
            'arr.push("' +
            str.replace(/[\r\t\n]/g, ' ')
            .replace(/"/g, '\\"')
            .replace(/&amp;/g, '&')
            .replace(/{{each\s\((.*?)\,\s?(.*?)\)\sin\s(.*?)\s?}}/g, '");for(var $1 in $3){var $2=$3[$1];arr.push("')
            .replace(/{{each\s(.*?)\sin\s(.*?)\s?}}/g, '");for(var i in $2){var $1=$2[i];arr.push("')
            .replace(/{{\/each}}/g, '");}arr.push("')
            .replace(/{{if\s(.*?)\s?}}/g, '");if ($1) {arr.push("')
            .replace(/{{else}}/g, '");}else{arr.push("')
            .replace(/{{\/if}}/g, '");}arr.push("')
            .replace(/{{\s?(.*?)\s?}}/g, '");arr.push($1);arr.push("') +
            '");return arr.join("");');
    }


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
        xhr('GET', url, function(data) {
            self.innerHTML = data;

            createJS(data);
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

    function createJS(str, callback) {
        str = str.replace(/[\n\t\r]/g, '');
        var reg = new RegExp(/<script>(.*?)<\/script>/, 'g');
        if (reg.test(str)) {
            var jstr = str.match(/<script>(.*?)<\/script>/g);
            if (jstr.length > 0) {
                for (var i = 0; i < jstr.length; i++) {
                    var js = jstr[i].replace(/<script>(.*?)<\/script>/g, '$1');
                    var jF = new Function(js);
                    jF();
                }
            }
        }

        if (callback) {
            callback(str);
        }
    }

    function loadJS(str, callback) {
        var reg = new RegExp(/<script src=\"(.*?)\"><\/script>/, 'g');
        if (reg.test(str)) {
            var jstr = str.match(/<script\ssrc\=\"(.*?)\">/g);

            if (jstr.length > 0) {
                for (var i = 0; i < jstr.length; i++) {
                    var js = jstr[i].replace(/<script\ssrc\=\"(.*?)\">/g, '$1');
                    var script = document.createElement("script");
                    script.src = js;
                    document.head.appendChild(script);
                }
            }
        }

        if (callback) {
            callback(str);
        }
    }


    //加载组件
    function loadComponent(url) {
        var self = this;
        xhr('GET', "scripts/component/" + url + ".js", function(data) {
            self.innerHTML = data;

            createJS(data);
        });
    }

    return {
        "publish": publish,
        "subscribe": subscribe,
        "tmpl": tmpl,
        "ajax": ajax,
        "loadComponent": loadComponent
    };
});