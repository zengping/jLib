define(function() {

    var template = `
        <div class="message">{{message}}</div>
    `;
    var script = `
        data = {
            message: "123"
        }

        var btn = document.querySelector(".message");
        btn.onclick = function(event){
            data.message = 5;
        }
    `;

    return {
        "template": template,
        "script": script
    };
});