/* 
 * Smartcss
 *
 * A plugin to load css files with the capability to add custom string to urls in css files
 * and unload loaded css parts if required
*/

define(['lib/text'], function(text) {

    function handleErrorsWhenLoading(error) {
        console.log(error);
    }

    // Adds a style tag with the css content into it
    function addStyle(name, css) {

        var head = getHead();
        var id = getId(name);

        var style = document.createElement("style");
        style.setAttribute("id", id);
        style.setAttribute("data-module", "smartcss");
        style.innerHTML = css + "\n /*@ sourceURL=" + name + " */";
        head.appendChild(style);

    }

    function remove(name) {
        var id = getId(name);
        var obj = document.getElementById(id);
        if (obj) {
            obj.parentNode.removeChild(obj);
        }
    }

    function add(url, done) {

        var loaded = false;

        var head = getHead();
        var id = getId(url);

        var link = document.createElement("link");
        link.setAttribute("id", id);
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", url);
        link.setAttribute("type", "text/css");
        link.setAttribute("data-module", "smartcss");

        link.addEventListener("load", function() {
            if(loaded === false) {
                loaded = true;
                done(link);
            }
        }, false);

        link.onreadystatechange = function(){
            if (this.readyState === 'complete' || this.readyState === 'loaded') {
                if(loaded === false) {
                    loaded = true;
                    done(link);
                }
            }
        };

        link.onload = function() {
            if(loaded === false) {
                loaded = true;
                done(link);
            }
        };

        head.appendChild(link);

        function check() {
            try {
                if ( link.sheet && link.sheet.cssRules.length > 0 ) {
                    loaded = true;
                }
                else if ( link.styleSheet && link.styleSheet.cssText.length > 0 ) {
                    loaded = true;
                }
                else if ( link.innerHTML && link.innerHTML.length > 0 ) {
                    loaded = true;
                }
            }
            catch(ex){ }

            if (loaded === true) {
                done(link);
            }
            else {
                setTimeout(check, 20);
            }
        };

        check();

    }

    function load(name, req, onload, config) {
        (function(name, req, onload, config) {
            if ((config.smartcss && config.smartcss.inject === true) || config.urlArgs) {
                text.get(name, function(css) {
                    addStyle(name, css);
                    onload(name);
                }, handleErrorsWhenLoading)
            }
            else {
                add(name, function(obj) {
                    //console.log(obj.sheet);
                    onload(name);
                });
            }
        })(name, req, onload, config);
    }

    function unload(name, done) {
        remove(name);
        done();
    }

    function getHead() {
        return document.getElementsByTagName("head")[0];
    }

    function getId(url) {
        var id = url.replace(/[\/\.]/gi, "-").toLowerCase();
        var prefix = "smartcss-";
        return prefix + id;
    }

    return {
        load: load,
        unload: unload,
        getHead: getHead,
        add: add,
        addStyle: addStyle,
        getId: getId
    };

});
