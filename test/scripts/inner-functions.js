define(function(require) {

    var smartcss = require("smartcss");

    describe("Smartcss inner functions", function() {

        before(function(done) {
            var self = this;
            this.req = function() { };
            this.config = { };
            this.testContext = document.getElementById("test-content");
            done();
        });

        beforeEach(function() {

            this.testObj = document.createElement("div");
            this.testObj.setAttribute("id", "foo");
            this.testContext.appendChild(this.testObj);

            this.testObj2 = document.createElement("div");
            this.testObj2.setAttribute("id", "picard");
            this.testContext.appendChild(this.testObj2);

            this.testObj3 = document.createElement("div");
            this.testObj3.setAttribute("id", "locutos");
            this.testContext.appendChild(this.testObj3);

         });

        afterEach(function() {
            var testContent = document.getElementById("test-content");
            testContent.innerHTML = "";

            var headContent = document.querySelectorAll("*[data-module=smartcss]");
            for(var i = 0, ii = headContent.length; i < ii; i++){
                headContent[i].parentNode.removeChild(headContent[i]);
            }
        });

        it("getHead returns the HEAD element", function() {
            var head = smartcss.getHead();
            chai.should().exist(head);
        });

        it("Loads an external css file and tell us its done", function(done) {

            var onload = function(name) {
                name.should.be.equal("style/chunk1.css");
                done();
            };

            smartcss.load("style/chunk1.css", this.req, onload, this.config);

        });

        it("Creates an id from a css url", function() {

            var id = smartcss.getId("test/style/chunk1.css");
            id.should.equal("smartcss-test-style-chunk1-css");

        });

        it("Add the css to the head section as a style tag with the correct id", function(done) {

            smartcss.load("style/chunk2.css", this.req, function() {
                var styleObj = document.querySelector("#smartcss-style-chunk2-css");
                chai.should().exist(styleObj);
                styleObj.innerHTML.should.contain("#foo");
                done();
            }, { 
                smartcss: {
                    inject: true
                }
            });

        });

        it("Add the css to the head section as link tag with the correct id", function(done) {

            smartcss.add("style/chunk2.css", function() {
                var styleObj = document.querySelector("#smartcss-style-chunk2-css");
                chai.should().exist(styleObj);
                styleObj.getAttribute("href").should.be.equal("style/chunk2.css");

                // for some reason, if we dont wait until the next frame, the next test will break wehn 
                // we run this form node. I guess it has to do with loading the external link and waiting for it
                // to actually be there
                setTimeout(done, 0);
            });

        });

        it("An added css will change the style of the desired object", function(done) {
            var self = this;
            smartcss.load("style/chunk1.css", this.req, function() {
                var style = window.getComputedStyle(self.testObj, null);
                style.color.should.equal("rgb(255, 0, 0)");
                done();
            }, this.config);
        });

        it("We can unload styles", function(done) {
            var self = this;
            smartcss.load("style/chunk1.css", this.req, function() {
                smartcss.unload("style/chunk1.css", function() {
                    var style = window.getComputedStyle(self.testObj, null);
                    style.color.should.not.equal("rgb(255, 0, 0)");
                    done();
                });
            }, this.config);
        });

        it("Css are added in the correct ordered", function(done) {
            var self = this;
            smartcss.load("style/chunk1.css", self.req, function() {
                smartcss.load("style/chunk2.css", self.req, function() {
                    var style = window.getComputedStyle(self.testObj, null);
                    style.color.should.equal("rgb(0, 255, 0)");
                    done();
                }, self.config);
            }, self.config);
        });

        it("Add returns the style dom object", function(done) {

            smartcss.add("style/chunk2.css", function(obj) {
                chai.should().exist(obj);
                obj.getAttribute("href").should.be.equal("style/chunk2.css");

                // for some reason, if we dont wait until the next frame, the next test will break wehn 
                // we run this form node. I guess it has to do with loading the external link and waiting for it
                // to actually be there
                setTimeout(done, 0);
            });

        });

        it("Adds the urlArgs to the url for getting the file", function(done) {

            var url = "";

            require(["text"], function(text) {

                var oldGet = text.get;
                text.get = function(name, next) {
                    url = name;
                    next();
                };

                smartcss.load("style/chunk2.css", this.req, function(obj) {
                    url.should.equal("style/chunk2.css?version=111");
                    text.get = oldGet;
                    done();
                }, { urlArgs: "version=111"});

            });

        });

        it("Adds the urlArgs to each url in a css", function(done) {

            var self = this;
            smartcss.load("style/chunk3.css", this.req, function() {

                var obj = document.getElementById("foo");
                var style = window.getComputedStyle(obj, null);
                style.backgroundImage.should.contain("temp.png?seed=101001");

                var obj = document.getElementById("picard");
                var style = window.getComputedStyle(obj, null);
                style.backgroundImage.should.contain("temp2.png?seed=101001");

                var obj = document.getElementById("locutos");
                var style = window.getComputedStyle(obj, null);
                style.backgroundImage.should.contain("temp3.png?seed=101001");

                done();
            }, { 
                urlArgs: "seed=101001"
            });

        });




    });

});
