'use strict'

	const pkg = require("../package.json");
	
	const self = {
		commands: function(e) {
			if (typeof e == "undefined") {
				self.help();
			} else {
				switch(true) {
					case (e == "rules"):
					case (e == "rule"):
						cldmv_image_sizer.rules.help();
						break;
					default:
						self.help();
						break;
				}
			}
		},
		help: function() {
			var usage = [
				// ''
			  // , '  Usage: image-sizer [options] image_file...'
			  '  Usage: image-sizer [options] image_file...'
			  , ''
			  , '  Options:'
			  , ''
			  , '    Option          requirement  Description'
			  // , ''
			  , '    -r, --rule      (required)   Sets which Config Rule to follow'
			  , '    -c, --config                 Sets what config file to use'
			  , '    -p, --print                  Print output of actions to screen'
			  , '    -v, --version                Display the version of CLDMV Image Sizer'
			  , '    -h, --help                   Display help information'
			  , ''
			].join('\n');
			self.version();
			console.error(usage);
		},
		example: function(example) {
			if (typeof example != "undefined") {
				var example_file = __dirname + '../config-examples/.image-sizer-' + example + '.json';
				console.log(example_file);
				return true;
			}
			return false;
			// __dirname + '../config-examples/'
			// if (fs.existsSync(configpath)) {
				// working_config = require(configpath);
			// }
		},
		version: function() {
			var usage = [
				''
			  , pkg.name + ' v' +pkg.version
			  , ''
			].join('\n');
			console.error(usage);
		}
	}
	
	module.exports = self;