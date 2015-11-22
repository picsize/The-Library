app = {
    clickFlag: false,
    deviceReady: function () {
        alert("deviceready");
        app.events();
        alert("before-begin");
        app.begin();
    },
    events: function () {
        $(document).on('click', '#page_zero', function () {
            alert("stage2")
        });
    },
    begin: function () {
        alert("in-begin");
    }

};

document.addEventListener("deviceready", app.deviceReady, false);