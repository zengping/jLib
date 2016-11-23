define(function() {
    var APP_DEV_ENV = 1,
        // 1开发环境 0生产环境
        appJoin = APP_DEV_ENV ? "?" : "",
        appType = {
            "insert": "POST",
            "del": "DELETE",
            "sel": "GET",
            "update": "UPDATE"
        };

    if (APP_DEV_ENV) {
        appType.insert = "GET";
        appType.del = "GET";
        appType.update = "GET";
    }

    function _appApi(code) {

        var appApi = {

            // 分页
            "PAGE_SIZE": 10,

            // 菜单
            "ALL_MENU": APP_DEV_ENV ? "./jsons/menu/menu.json" : "./jsons/menu/menu.json",

            // 查询菜单
            "INDEX_MENU": APP_DEV_ENV ? "./jsons/menu.json" : "./jsons/menu.json",

            // 
            "T_TASKIF": APP_DEV_ENV ? "./jsons/taskif/taskif.json" : "./jsons/taskif/taskif.json",

            //
            "T_LIST": APP_DEV_ENV ? "./jsons/task/control/list.json" : "./jsons/task/control/list.json"
        };

        return appApi[code];
    }

    return {
        appJoin: appJoin,
        appType: appType,
        appApi: function(code) {
            return _appApi(code);
        }
    };
});