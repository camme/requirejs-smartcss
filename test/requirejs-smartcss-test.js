var connect = require('connect');
var should = require("should");
var requirejs = require("requirejs");
var path = require("path");
var phantom = require("phantom");

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    baseUrl: path.join(__dirname, "..")
});

describe("Smartcss inner functions", function() {

    before(function(done) {

        var self = this;

        this.req = function() { };
        this.config = { };


        var root = path.join(__dirname, "../");
        self.server = connect().use(connect.static(root)).listen(1337, function() {

            requirejs(['smartcss'], function(smartcss) {
                self.smartcss = smartcss;

                phantom.create(function(ph) {
                    self.ph = ph;
                    ph.createPage(function(page) {
                        self.page = page;
                        page.open("http://localhost:1337/test/www/index.html", function() {
                            done();
                        });
                    });
                });

            });

        });

    });


    after(function(done) {
        this.ph.exit();
        this.server.close(done);
    });


    it("Loads an external css file and tell us its done", function(done) {

        var onload = function(name) {
            name.should.be.equal("test/www/style/chunk.css");
            done();
        };

        this.smartcss.load("test/www/style/chunk.css", this.req, onload, this.config);

    });

    it("Add the css to the head section with the correct id", function(done) {

        

        var self = this;

        self.page.evaluate(function() {

        var onload = function(name) {
            //should.exist(self.$("head>#test-style-chunk"));
            //self.$("head>#test-style-chunk").html().should.containe("#foo");
            //self.$("head>#test-style-chunk").html().should.containe("red");
            done();
        };

            require(["/require-smartcss.js"], function(smartcss) {
                smartcss.load("test/www/style/chunk.css", this.req, onload, this.config);

                smartcss.
                done();
            });
        });


    });


});
