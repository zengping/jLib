define(function() {

    return function() {
        if (("onhashchange" in window) && ((typeof document.documentMode === "undefined") || document.documentMode == 8)) {

            window.onhashchange = function() {
                var url = window.location.href;
                var url_arr = url.match(/[index\.html|\/]\#(.*?)$/);
                var viewUrl = url_arr ? url_arr[1] : "";
                if (!viewUrl) {
                    viewUrl = "index/index";
                }
                require(["./scripts/app/" + viewUrl], function(event) {
                    event();
                });
            };
            onhashchange();
        }
    };
});