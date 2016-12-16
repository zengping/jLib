define(function() {

    var template = `
        <div id="headbar">
            <div class="sys-logo">
                <h1>重庆市工业产品质量信息报送管理系统</h1>
            </div>
            <div class="sys-menu" id="sys-menu">
                <ul>
                <li j-for="(key, val) in menu" j-class="{{val.urlType}}">
                    {{val.urlType}}
                </li>
                </ul>
                <div class="curline"></div>
            </div>
            <div class="user-info">
                <span title="点击可修改密码" class="welcome showPwd">
                    <a href="javascript:void(0);">
                        <img alt="" src="../assets/imgs/user-img.png">
                        <b class="userSelfName"></b>
                    </a>
                </span>
                <span class="welcome" id="logout">
                    <i class="icon-shutdown" title="退出"></i>
                </span>
            </div>
        </div>
    `;
    var script = `
        return {
            el: "#headbar",
            data: {
                menu: []
            },
            methods:{
                init: function(){
                    var self = this;
                    self.$get("./jsons/menu.json").then(function(res) {
                        self.menu = [1, 2, 3];
                    }, function(err) {
                        console.error("Failed!", err);
                    });
                }
            }
        }
    `;
    var css = "";

    return {
        "tmpl": template,
        "script": script,
        "css": css
    };
});