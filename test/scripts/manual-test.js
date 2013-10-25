requirejs.config({
    baseUrl: "../",
    smartcss: {
        inject: true
    }
});

require(['smartcss!style/chunk1.css'], function(smartcss) {


});


