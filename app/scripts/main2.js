(function(win) {
    /*
     * 文件依赖
     */
    var config = {
        baseUrl: './',
        paths: {
            jLibs: './scripts/jLibs',
            router: './scripts/router',
            appData: "./scripts/app/appData"
        },
        shim: {}
    };

    require.config(config);
    require(['jLibs', 'router', 'appData'], function(jLibs, router, appData) {
        // win.appView = document.querySelector('[j-view]'); //用于模块控制视图变化
        // win.appData = appData;
        // win.viewsChange = router; //监控views变化
        // viewsChange();
        new jLibs({ el: '#app' });
    });


})(window);