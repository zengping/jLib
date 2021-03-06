define(['../../app/jLibs'], function(jLibs) {

    var t = {};

    function init() {
        appView.innerHTML = t.page;
    }

    function bindData(data) {
        jLibs.subscribe("menuDataBind", function(topic, data) {
            jLibs.tmpl(data);
        });
        jLibs.publish("menuDataBind", {
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

        jLibs.loadComponent("menu/index");
    }

    (function getTmpl() {
        t.page = `
            <div>
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