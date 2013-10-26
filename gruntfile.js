/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: '<json:package.json>',

        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */'
        },

        mocha: {
            all: {
                src: [ 'test/*.html' ],
                options: {
                    log: true
                }
            }
        },

        watch: {
            files: ['test/**/*.*'],
            tasks:'mocha'
        },

        requirejs: {
            compile: {
                options: {
                    appDir: "./test/scripts",
                    baseUrl: "./",
                    optimize: "none",
                    findNestedDependecies: true,
                    dir: "./test/scripts-prod",
                    paths: {
                        css: "../../smartcss",
                        text: "../../text",
                        style: "../style"
                    },
                    modules: [
                        { name: "test-module" }
                    ],
                    urlArgs: "ver=77"
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-mocha');

    // Default task.
    grunt.registerTask('test', 'mocha', 'requirejs');
    grunt.registerTask('watch', 'watch');

};
