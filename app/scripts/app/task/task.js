define(['../jLibs'], function(jLibs) {

    var t = {};

    function init() {
        appView.innerHTML = t.page;

        loadTable();
    }

    function bindData(data) {
        jLibs.subscribe("taskDataBind", function(topic, data) {
            jLibs.tmpl(data);
        });
        jLibs.publish("taskDataBind", {
            name: "data",
            data: data.content
        });
        jLibs.publish("taskDataBind", {
            name: "list",
            data: data.content
        });
        loadEvent();
    }

    function loadTable() {

        var ad = appData;

        ad.selectList("T_LIST", {}, function(data) {

            bindData(data);

        });
    }

    function loadEvent() {
        var button = document.querySelector("button");
        button.onclick = function(event) {
            location.href = "";
            event.stopPropagation();
        };
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

            <button>to menu</button>
        `;
    })();

    return init;
});