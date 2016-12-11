(function(win) {
    /*
     * 文件依赖
     */
    var config = {
        baseUrl: './',
        paths: {
            jp: './scripts/jp',
            router: './scripts/router'
        },
        shim: {}
    };

    require.config(config);
    require(['jp', 'router'], function(jp, router) {
        new jp({ el: '#banner', components: "./scripts/app/index/banner" });
        // new jp({ el: '#left' });
        new jp({ el: '#app', router: router });
    });


})(window);