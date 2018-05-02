'use strict'

	const 	image_sizer = require('./lib/image_sizer.js'),
			fs = require('fs'),
			jimp = require('jimp');

	const pkg = require("./package.json");
	
	var args = process.argv.slice(2);
	var files = [];
	
	function error_rules() {
		var usage = [
			''
		  , '  Usage: -r rule_name'
		  , ''
		  , '  Requirements:'
		  , ''
		  , '    Rules must contain one of the following sets: '
		  , '      An array of numbers'
		  , '        Example:'
		  , '          [1024,1024]'
		  , '          [256,96]'
		  , ''
		  , '      An array of objects'
		  , '        Example:'
		  , '          ['
		  , '            {'
		  , '              x: 1024,'
		  , '              y: 1024'
		  , '            },'
		  , '            {'
		  , '              x: 256,'
		  , '              y: 96'
		  , '            }'
		  , '          ]'
		  , ''
		  , '      An array of arrays'
		  , '        Example:'
		  , '          ['
		  , '            ['
		  , '              1024,'
		  , '              1024'
		  , '            ],'
		  , '            ['
		  , '              256,'
		  , '              96'
		  , '            ]'
		  , '          ]'
		  , ''
		  , '    Note: Objects and arrays can be mixed in the 2 last examples'
		  , ''
		  , '    For more examples use the -e [--example] command'
		  , ''
		].join('\n');
		console.error(usage);
	}
	
	console.log('args');
	console.log(args);
	
	if (args.length == 0) {
		image_sizer.help.commands();
		return;
	}
	
	var arg;
	while (args.length) {
		arg = args.shift();
		switch (arg) {
			case '-h':
			case '--help':
				image_sizer.help.commands();
				return;
				break;
			case '-e':
			case '--example':
				var e = args.shift();
				if (!image_sizer.help.example(e)) {
					image_sizer.help.commands();
					return;
				}
				return;
				break;
			case '-r':
			case '--rule':
				image_sizer.config.rule = args.shift();
				break;
			case '-c':
			case '--config':
				image_sizer.config.path = process.cwd() + '/./' + args.shift();
				break;
			case '-p':
			case '--print':
				image_sizer.config.print = true;
				break;
			case '-v':
			case '--version':
				image_sizer.help.version();
				return;
			default:
				files.push(arg);
		}
	}
	
	if (!image_sizer.config.process()) {
		image_sizer.help.commands();
		return;
	} else {
		if (!image_sizer.rules.process(image_sizer.config)) {
			image_sizer.help.commands();
			return;
		}
	}
	
	// if (rule) {
		// rule = rule.toLowerCase();
	// } else {
		// image_sizer.help.commands();
		// return;
	// }
	// console.log('config');
	// console.log(config);
