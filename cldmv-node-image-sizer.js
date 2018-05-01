'use strict'

	const 	sharp = require('sharp'),
			fs = require('fs');

	var args = process.argv.slice(2);

	var print = false;
	var rule = false;
	var config = {};
	var files = [];
	var configpath = process.cwd() + "/.image-sizer.json";

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

	var arg;
	while (args.length) {
		arg = args.shift();
		switch (arg) {
			case '-h':
			case '--help':
			console.error(usage);
			// return;
			break;
		case '-r':
		case '--rule':
			rule = args.shift();
			break;
		case '-c':
		case '--config':
			configpath = args.shift();
			break;
		case '-p':
		case '--print':
			print = true;
			break;
		case '-V':
		case '--version':
			console.log(stylus.version);
			return;
		default:
			files.push(arg);
		}
	}

	console.log(configpath);

	if (fs.existsSync(configpath)) {
		config = require(configpath);
	}

	if (typeof config.rules != "undefined") {

	} else {
		if (typeof config.type != "undefined") {

		} else {

		}
	}
	console.log(config);

	if (rule) {

	} else {

	}
