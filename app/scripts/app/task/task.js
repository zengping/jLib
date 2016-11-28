define(['../jLibs'], function(jLibs) {

    var t = {};

    function init() {
        appView.innerHTML = t.page;

        loadTable();
    }

    function bindData(data) {
        jLibs.subscribe("taskDataBind", function(topic, data) {
            jLibs.tmpl('task', data);
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
            location.href = "#";
            event.stopPropagation();
        };

        jLibs.loadComponent("menu/menu");
    }

    (function getTmpl() {
        t.page = `
            <div id="task">
            </div>
            <menu></menu>

            <button>to menu</button>
        `;
    })();

    return init;
});