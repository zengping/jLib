define(['../jLibs'], function(jLibs) {

    var t = {};

    function init() {
        appView.innerHTML = t.page;

        loadMenu();
    }

    function bindData(data) {
        jLibs.subscribe("indexDataBind", function(topic, data) {
            jLibs.tmpl('index', data);
        });
        jLibs.publish("indexDataBind", {
            name: "data",
            data: data
        });
        loadEvent();
    }

    function loadMenu() {
        var ad = appData;

        // TODO: 查询菜单
        ad.selectMenu("INDEX_MENU", {}, function(data) {

            bindData(data);
        });
    }

    function loadEvent() {
        var button = document.querySelector("button");
        button.onclick = function(event) {
            location.href = "#task/task";
            event.stopPropagation();
        };

        jLibs.loadComponent("menu/menu");
    }

    (function getTmpl() {
        t.page = `
            <div id="index">
                <ul>
                    <li class="" j-for="v in data">
                        <a class="sys-sidebar-item" href="javascript:void(0);">{{v.name}}</a>
                        <ul class="sys-sidebar-child">
                            <li class="" j-for="(key,val) in v.child" data-url="{{val.url}}">
                                <a href="#{{val.url}}">
                                    <i class="{{val.icon}}"></i>
                                    {{val.name}}
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <menu></menu>

            <button>to menu</button>
        `;
    })();

    return init;
});