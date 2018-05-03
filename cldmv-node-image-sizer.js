'use strict'

	global.define = function define(name, value) {
		global[name] = value;
	}
	
	const 	cldmv_image_sizer = require('./lib/cldmv_image_sizer.js'),
			fs = require('fs'),
			jimp = require('jimp');
			
	define('cldmv_image_sizer', cldmv_image_sizer);

	const pkg = require("./package.json");
	
	var args = process.argv.slice(2);
	var files = [];
	
	if (args.length == 0) {
		cldmv_image_sizer.help.commands();
		return;
	}
	
	var arg;
	
	while (args.length) {
		arg = args.shift();
		switch (arg) {
			case '-h':
			case '--help':
				var e = args.shift();
				cldmv_image_sizer.help.commands(e);
				return;
				break;
			case '-e':
			case '--example':
				var e = args.shift();
				if (!cldmv_image_sizer.help.example(e)) {
					cldmv_image_sizer.help.commands('example');
					return;
				}
				return;
				break;
			case '-r':
			case '--rule':
				var next = args[0];
				while (cldmv_image_sizer.maybeAdditionalArg(next)) {
					cldmv_image_sizer.config.addParseRule(args.shift());
					next = args[0];
				}
				break;
			case '-c':
			case '--config':
				var next = args[0];
				while (cldmv_image_sizer.maybeAdditionalArg(next)) {
					cldmv_image_sizer.config.addNewParsePath(args.shift());
					next = args[0];
				}
				break;
			case '-p':
			case '--print':
				cldmv_image_sizer.config.enablePrint();
				break;
			case '-v':
			case '--version':
				cldmv_image_sizer.help.version();
				return;
			default:
				files.push(arg);
		}
	}
	
	cldmv_image_sizer.run();
