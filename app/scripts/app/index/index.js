define(function() {

    var template = `
        <div id="index">
            <div class="sys-header" id="sys-header">
                <headbar></headbar>
            </div>

            <div class="sys-main" id="sys-main">
            </div>
        </div>

    `;
    var script = `
        return {
            el: "#index",
            data: {
                message: "123"
            },
            components: {
                headbar: "./scripts/components/headbar"
            },
            methods:{
                btn:function(){
                    this.message = 5;
                }
            }
        }
    `;
    var css = "styles/style.css";

    return {
        "tmpl": template,
        "script": script,
        "css": css
    };
});