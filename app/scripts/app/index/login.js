define(function() {

    var template = `
        <div id="login">
            <div class="loginbox">
                <!-- 登录 -->
                <div class="logininfo">
                    <h3><img src="../assets/imgs/login_logo.png" alt="重庆市工业产品信息报送管理系统" /></h3>
                    <dl class="basedl">
                        <dd class="login-msg">
                            <div id="wrong_space">
                                <i class="icon-alert"></i>
                                <div id="login_wrong" tabindex="">
                                    <em class="wish-notification2"></em>
                                </div>
                            </div>
                        </dd>
                        <dd>
                            <input type="text" class="form-control login_user" placeholder="用户名" datatype="*2-20" j-model="pdata.username">
                        </dd>
                        <dd>
                            <input type="password" class="form-control login_pwd" placeholder="密码" datatype="*6-15" j-model="pdata.password">
                        </dd>
                        <dd>
                            <input type="hidden" id="use_key_serial">
                            <input type="password" class="form-control login_ping" placeholder="Pin Code" id="id_pin" j-model="pdata.usbkey">
                        </dd>
                        <dd>
                            <button class="login_btn" id="login_btn" j-on:click="login">登 录</button>
                            <a href="javascript:void(0);" id="extensionDownload"><i class="icon-cloud-down"></i>插件下载</a>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>

    `;

    function script() {
        var obj = {
            el: "#login",
            data: {
                pdata: {
                    username: "",
                    password: "",
                    usbkey: ""
                }
            },
            methods: {
                login: function() {
                    var self = this;
                    self.$get("./jsons/onoff.json", self.pdata).then(function(data) {
                        if (data) {
                            location.href = "#index";
                        }
                    }, function(err) {
                        console.error("Failed!", err);
                    });
                }
            }
        }
        return obj;
    }

    var css = "styles/style.css";

    return {
        "tmpl": template,
        "script": script(),
        "css": css
    };
});