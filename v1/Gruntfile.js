module.exports = grunt => {
    grunt.initConfig({
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['shell:flask', 'watch', 'shell:tscWatch']
        },
        shell: {
            uglify: {
                command: 'uglifyjs static/dist/bundle.js -mc -o static/dist/bundle.min.js'
            },
            flask: {
                command: 'flask run --host=0.0.0.0 --debug'
            },
            tscWatch: {
                command: 'tsc -w'
            },
            tsc: {
                command: 'tsc'
            },
            browserify: {
                command: 'browserify static/js/main.js -o static/dist/bundle.js'
            }
        },
        watch: {
            default: {
                files: ['static/js/**'],
                tasks: ['shell:browserify', 'shell:uglify']
            }
        }
    })
    grunt.loadNpmTasks('grunt-concurrent')
    grunt.loadNpmTasks('grunt-shell-spawn')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.registerTask('dev', ['shell:tsc', 'shell:browserify', 'shell:uglify', 'concurrent'])
}