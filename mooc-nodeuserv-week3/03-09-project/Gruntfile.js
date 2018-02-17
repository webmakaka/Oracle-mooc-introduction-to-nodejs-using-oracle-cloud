/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    //Project configuration.
    grunt.initConfig({
        //Compress Config.
        compress: {
            main: {
                options: {
                    archive: 'MovieApp-grunt.zip',
                    pretty: true
                },
                expand: true, cwd: './',
                src: ['**/*', '!*.zip'], dest: './'
            }
        }
    });
    //Default Task(s)
    grunt.registerTask('default', ['compress']);
}