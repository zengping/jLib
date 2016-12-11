define(function() {

    var template = `
        <div id="index">
            <span j-on:click="btn">{{message}}</span>
        </div>

    `;
    var script = `
        return {
            el: "#index",
            data: {
                message: "123"
            },
            methods:{
                btn:function(){
                    this.message = 5;
                }
            }
        }
    `;

    return {
        "tmpl": template,
        "script": script
    };
});