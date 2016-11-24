define(['../../app/jLibs'], function(jLibs) {

    var t = {};

    function init(ele) {

        var eleP = ele.parentNode;
        var nEle = document.createElement("div");
        nEle.id = "menu";
        nEle.innerHTML = t.page;
        for (var i = 0; i < eleP.childNodes.length; i++) {
            if (eleP.childNodes[i].outerHTML == "<menu></menu>") {
                eleP.insertBefore(nEle, eleP.childNodes[i]);
                eleP.removeChild(eleP.childNodes[i + 1]);
            }
        }

        initData();
    }

    function bindData(data) {
        jLibs.subscribe("menuDataBind", function(topic, data) {
            jLibs.tmpl('menu', data);
        });
        jLibs.publish("menuDataBind", {
            name: "data",
            data: data
        });
    }

    function initData() {
        var ad = appData;

        // TODO: 查询菜单
        ad.selectMenu("COMPONENT_MENU", {}, function(data) {

            bindData(data);
        });
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
        `;
    })();

    return init;
});