var path = require('path');
var fs = require('fs');
var toc = require('markdown-toc');
var Mocha =  require('mocha');

var sampledir = 'test/samples/';

function listAllFiles(dir, retval) {
    retval = (retval == null) ? [] : retval;
    var files = fs.readdirSync(dir);
    files.forEach(function(f) {
        var fpath = path.join(dir, f);
        if ( fs.statSync(fpath).isDirectory() ) {
            listAllFiles(fpath, retval);
        }
        else {
            retval.push(fpath)
        }
    })
    return retval;
}
function runMochaTest(filename) {
    var result = '';

    /*var mocha = new Mocha({
        reporter : function(runner) { 
            var passes = 0;
            var failures = 0;
            runner.on('pass', function(test){
                passes++;
                result += 'pass: ' +  test.fullTitle();
            });

            runner.on('fail', function(test, err){
                failures++;
                result += 'fail: ' + test.fullTitle() +  '-- error: ' +  err.message;
            });

            runner.on('end', function(){
                result += 'end: passes :' + passes + 'failures: ' + failures;
                process.exit(failures);
            });
        }
    });*/
    var mocha = new Mocha({
        reporter : 'markdown'
    });
    mocha.addFile(filename);

    mocha.run(function(failures){
      process.on('exit', function () {
        process.exit(failures);  // exit with non-zero status if there were failures
      });
    });
    return result;

}
function buildObj(f, data) {
    var rpath = f.replace(sampledir,'');
    var fpath = rpath.replace('\.js','');
    var tokens = fpath.split('/');
    var ref = data;
    tokens.forEach(function(t, index) {
        if ( ref[t] == null ) {
            if ( index === (tokens.length - 1) ) {
                try {
                    console.log('working on ', f);
                    if (f.match('test/samples/ta/auth-test')) {
                        ref[t] = runMochaTest('./'+f);
                        console.log('mocha test return was:' , ref[t]);
                    }
                    else {
                        ref[t] = JSON.stringify(require('./' + f), null,4)
                    }
                }
                catch(err) {
                    console.log('error processing ', f);
                    throw(err)
                }
            }
            else {
                ref[t] = {};
            }
        }
        ref = ref[t];
    })
}

function getTOC(data) {
	data.toc = {};
    var files = [
		'docs/templates/overview.md',
		'docs/templates/builtins.md',
		'docs/templates/cblib.md',
		'docs/templates/example-ir.md',
		'docs/templates/example-ta.md',
		'docs/templates/acknowledgements.md',
	];
	files.forEach(function(f) {
		var rpath = f.replace('docs/templates/', '');
		var fname = rpath.replace('\.md','');

		var content = fs.readFileSync(f, 'utf8');
		data.toc[fname] = toc(content).json;
	});
}

function genData() {
    var data = {};
    var files = listAllFiles(sampledir);
    files.forEach(function(f) {
        buildObj(f, data);
    })
	getTOC(data);
    return data;
}

module.exports = function(grunt) {
    'use strict';

    // Load NPM Tasks. Either load them manully or use matchdep node moldule. Its a dev dependency not a package dependency. 
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        nunjucks: {
            options: {
                tags: {
                    blockStart    : '[%',
                    blockEnd      : '%]',
                    variableStart : '[_',
                    variableEnd   : '_]',
                    commentStart  : '[#',
                    commentEnd    : '#]'
                },
                paths: '.',
                data: genData()
            },
            genMarkdown: {
                files: [{
                    expand : true,
                    cwd    : 'docs/templates',
                    src    : '*.md',
                    dest   : 'docs/md',
                    ext    : '.md'
                }],
            } 
        },
        md2html: {
            genFiles: {
                options: {
                    layout: 'docs/layout/layout.html',
                },
                files: [{
                    expand: true,
                    cwd: 'docs/md',
                    src: ['**/*.md'],
                    dest: 'docs/html',
                    ext: '.html'
                }]
            },

        },
        /*shell : {
            TaSample : { command : '(cp -f test/tests/ta/* docs/js/)'  }
        }*/
    });

    grunt.registerTask('default', ['nunjucks:genMarkdown']);
    grunt.registerTask('gen-html', ['default', 'md2html:genFiles', /*'shell:TaSample'*/]);
};
