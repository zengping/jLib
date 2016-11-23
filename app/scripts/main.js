(function(win) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

    /*
     * 文件依赖
     */
    var config = {
        baseUrl: baseUrl,
        paths: {
            router: './scripts/router',
            appData: "./scripts/app/appData"
        },
        shim: {}
    };

    require.config(config);
    require(['router', 'appData'], function(router, appData) {
        win.appView = document.querySelector('[j-view]'); //用于模块控制视图变化
        win.appData = appData;
        win.viewsChange = router; //监控views变化
        viewsChange();
    });


})(window);