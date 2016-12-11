define(function() {

    var template = `
        <div id="banner">
            <span j-on:click="btn">{{message}}</span>
            <input type="text" j-model="obj.name">
            {{obj.age}}
            <ul>
            <li j-for="i in list">{{i.taskName}}</li>
            </ul>
        </div>
    `;
    var script = `
        return {
            el: "#banner",
            data: {
                message: "1233",
                obj:{},
                list:[]
            },
            methods:{
                btn: function(){
                    this.message = 6;
                },
                init: function(){
                    var self = this;
                    self.$get("./jsons/banner.json").then(function(res) {
                        self.obj = res;
                    }, function(err) {
                        console.error("Failed!", err);
                    });
                    self.$get("./jsons/task/list.json").then(function(res) {
                        self.list = res.content;
                    }, function(err) {
                        console.error("Failed!", err);
                    });
                }
            }
        }
    `;

    return {
        "tmpl": template,
        "script": script
    };
});