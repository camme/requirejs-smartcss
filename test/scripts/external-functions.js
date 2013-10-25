define(function(require) {

    var smartcss = require("smartcss");

    describe("Smartcss inner functions", function() {

        before(function(done) {
            var self = this;
            this.req = function() { };
            this.config = { };
            done();
        });


        //after(function(done) {
        //done();
        //});
        //
        it("getHead returns the HEAD element", function() {
            var head = smartcss.getHead();
            chai.should().exist(head);
        });

        it("Loads an external css file and tell us its done", function(done) {

            var onload = function(name) {
                console.log(name);
                name.should.be.equal("test/www/style/chunk.css");
                done();
            };

            smartcss.load("test/www/style/chunk.css", this.req, onload, this.config);

        });

        it("Add the css to the head section with the correct id", function(done) {

            var self = this;

            var onload = function(name) {
                var styleObj = document.querySelector("#test-style-chunk");
                chai.should().exist(styleObj);
                styleObj.innerHTML.should.contain("#foo");
                //self.$("head>#test-style-chunk").html().should.containe("#foo");
                //self.$("head>#test-style-chunk").html().should.containe("red");
                done();
            };

            require(["smartcss"], function(smartcss) {
                smartcss.load("test/www/style/chunk.css", this.req, onload, this.config);
            });


        });


    });

});
