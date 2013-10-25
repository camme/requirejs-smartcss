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

    });

    grunt.loadNpmTasks('grunt-mocha');

    // Default task.
    grunt.registerTask('test', 'mocha');
    grunt.registerTask('watch', 'watch');

};
