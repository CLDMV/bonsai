'use strict'

	const 	jimp = require('jimp'),
			deepmerge = require('deepmerge'),
			fs = require('fs');

	const default_config = require("./.image-sizer.json");
	
	var args = process.argv.slice(2);
	var rule = false;
	var working_config = {};
	var config = {};
	var files = [];
	var configpath = process.cwd() + "/.image-sizer.json";

	function help() {
		var usage = [
			''
		  , '  Usage: image-sizer [options] [file(s)]'
		  , ''
		  , '  Options:'
		  , ''
		  , '    -r, --rule              Sets which Config Rule to follow'
		  , '    -c, --config            Sets what config file to use'
		  , '    -p, --print             Print output of actions to screen'
		  , '    -V, --version           Display the version of CLDMV Image Sizer'
		  , '    -h, --help              Display help information'
		  , ''
		].join('\n');
		console.error(usage);
	}
	
	console.log(args);
	
	if (args.length == 0) {
		help();
		// return;
	}
	
	var arg;
	while (args.length) {
		arg = args.shift();
		switch (arg) {
			case '-h':
			case '--help':
			help();
			// return;
			break;
		case '-r':
		case '--rule':
			rule = args.shift();
			break;
		case '-c':
		case '--config':
			configpath = process.cwd() + '/./' + args.shift();
			break;
		case '-p':
		case '--print':
			config.print = true;
			break;
		case '-V':
		case '--version':
			console.log(stylus.version);
			return;
		default:
			files.push(arg);
		}
	}

	if (fs.existsSync(configpath)) {
		working_config = require(configpath);
	}

	if (typeof working_config.rules != "undefined") {
		config = deepmerge(default_config, working_config);
	} else {
		config = deepmerge(default_config, {});
		if (typeof working_config.type != "undefined") {
			config.rules = deepmerge(config.rules, working_config);
		} else {
			var t = working_config;
			working_config = {
				"tmp": t
			};
			config.rules = deepmerge(config.rules, working_config);
		}
	}

	if (rule) {
		rule = rule.toLowerCase();
		console.log('rule');
		console.log(rule);
		var tmprules = {};
		Object.keys(config.rules).forEach(function(r) {
			tmprules[r.toLowerCase()] = config.rules[r];
		});
		config.rules = tmprules;
		var found_rule = false;
		if (typeof config.rules[rule] == "undefined") {
			Object.keys(config.rules).forEach(function(r) {
				if (typeof config.rules[r].alias != "undefined") {
					config.rules[r].alias.forEach(function(e,a) {
						if (e.toLowerCase() == rule) {
							found_rule = config.rules[r];
						}
					});
				}
			});
		} else {
			found_rule = config.rules[rule];
		}
		if (found_rule !== false) {
			console.log('found_rule');
			console.log(found_rule);
		} else {
			help();
			// return;			
		}
	} else {
		help();
		// return;
	}
	console.log('config');
	console.log(config);
