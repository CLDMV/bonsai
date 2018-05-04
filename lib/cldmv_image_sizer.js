'use strict'

	const 	fs = require('fs'),
			process_path = require('path'),
			jimp = require("jimp");

	// jimp.deflateStrategy(3);		
	
	var images = [];
	var sizes = {};
	
	function isNumeric(num){
		return !isNaN(num)
	}
	
	const self = {
		help: require('./help.js'),
		config: require('./config.js'),
		rules: require('./rules.js'),
		run: function() {			
			if (!self.config.process()) {
				self.help.commands();
				return;
			} else {
				var success = self.rules.process();
				if (!success) {
					self.help.commands();
					return;
				} else {
					if (typeof success == "function") {
						success();
						return;
					}
					var found_rules = self.config.getFoundParseRules();
					
					// console.log(found_rules);
					
					if (found_rules.length > 0) {
						// console.log('found_rules');
						// console.log(found_rules);
						found_rules.forEach(function(found_rule,k) {
						// Object.keys(found_rules).forEach(function(k) {
							// var found_rule = found_rules[k];
							// var rule_name = 
							// console.log('found_rule');
							// console.log(found_rule);
							found_rule.values.forEach(function(r) {
								switch(true) {
									case (typeof r == "number"):
										sizes[r] = true;
										break;
									case (typeof r.x != "undefined" && typeof r.y != "undefined"):
										var k = r.x + 'x' + r.y;
										sizes[k] = r;
										break;
									case (Array.isArray(r) && r.length == 2):
									case (Array.isArray(r) && r.length == 2):
										var k = r.x + 'x' + r.y;
										sizes[k] = r;
										break;
									default:
										self.rules.help();
										break;
								}
							});
						});
						// console.log(self.config.getFiles());
						// console.log(sizes);
						self.config.getFiles().forEach(function(file) {
							if (!process_path.isAbsolute(file)) {
								file = process.cwd() + '/./' + file;
							}
							file = process_path.normalize(file);
							images.push(file);
						});
						self.processImage(images.shift());
					} else {
						return;		
					}
				}
			}
		},
		processNewImageName: function(new_image_path, k) {
			
			var optional_search = "([\-\_])?(-percent)?"
			
			var regex = new RegExp("([\-\_])" + k,"i");
			new_image_path = new_image_path.replace(regex,'{REPLACE_ME_PREFIX}');
			regex = new RegExp(k + "([\-\_])","i");
			new_image_path = new_image_path.replace(regex,'{REPLACE_ME_SUFFIX}');
			regex = new RegExp("([\-\_])" + k + "([\-\_])","i");
			new_image_path = new_image_path.replace(regex,'{REPLACE_ME_BOTH}');
			regex = new RegExp("([\-\_])?[0-9]+([\-\_]|)?(percent)","i");
			new_image_path = new_image_path.replace(regex,'{REPLACE_ME_PERCENT}');
			regex = new RegExp(k,"i");
			new_image_path = new_image_path.replace(regex,'{REPLACE_ME}');
			regex = new RegExp("([\-\_])?[0-9]+x[0-9]+([\-\_])?","i");
			var found = new_image_path.match(regex);
			if (found) {
				new_image_path = new_image_path.replace(regex,'{REPLACE_ME}')
			}
			
			// var insert = k;
			// if (k.indexOf('x') == -1) {
				// insert = k + '-percent';
			// }
			
			var replaces = {
				'{REPLACE_ME_PREFIX}': '-{R}',
				'{REPLACE_ME_SUFFIX}': '{R}-',
				'{REPLACE_ME_BOTH}': '-{R}-',
				'{REPLACE_ME_PERCENT}': '{R}-percent',
				'{REPLACE_ME}': '-{R}-'
			};
			
			Object.keys(replaces).forEach(function(r) {
				var t = replaces[r];
				if (r != '{REPLACE_ME_PERCENT}' && k.indexOf('x') == -1 && t.indexOf('-percent') == -1) {
					t = t.replace('{R}',k+'-percent');
				} else {
					t = t.replace('{R}',k);
				}
				new_image_path = new_image_path.replace(r,t);
			});
			// clean up possible -. or _. strings
			regex = new RegExp("([\-\_])?\\.","i");
			new_image_path = new_image_path.replace(regex,'.');
			return new_image_path;
		},
		processImage: function(image_path) {
			var next = images.shift();
			if (fs.existsSync(image_path)) {
				jimp.read(image_path,function(err, base_image) {
					if (err) throw err;
					
					self.print('Processing file: ' + image_path);
					Object.keys(sizes).forEach(function(k) {
						var image = base_image.clone();
						var size = sizes[k];
						if (k.indexOf('x') != -1) {
							self.print('  Processing size: ' + k);
						} else {
							self.print('  Processing size: ' + k + '%');
						}
						// console.log(typeof size)
						// console.log(typeof k)
						switch(true) {
							// case (typeof k == "number"):
							case (isNumeric(k)):
								// percentage
								size = k;
								if (size > 1) {
									size = size / 100;
								}
								image.scale(size);
								break;
							case (k.indexOf('x') != -1):
								switch(true) {
									case (typeof size.x != "undefined" && typeof size.y != "undefined"):
										image.resize(size.x, size.y);
										break;
									case (typeof size.x != "undefined"):
										image.resize(size.x, Jimp.AUTO);
										break;
									case (typeof size.y != "undefined"):
										image.resize(Jimp.AUTO, size.y);
										break;
								}
								break;
							default:
								
								break;
						}
						
						// switch(process_path.extname(image_path)) {
							// case 'png':
								// image.deflateLevel(3);
								// break;
						// }
						
						var dir = process_path.dirname(image_path);
						var new_image_path = process_path.basename(image_path);
						new_image_path = self.processNewImageName(new_image_path,k);
						var new_path = process_path.join(dir, self.config.relative_save_path, new_image_path);						
						image.write(new_path);
						self.print('    Saved as: ' + new_path);
					});
					if (typeof next != "undefined") {
						self.processImage(next);
					}
				});
			} else {
				console.error('File not found: '+file);
			}
		},
		print: function(string, join_array) {
			if (self.config.print) {
				if (join_array) {
					console.log(string.join('\n'));
				} else {
					console.log(string);
				}
			}
		},
		maybeAdditionalArg: function(arg) {
			if (typeof arg != "undefined") {
				var fourback = arg.substring(arg.length-4);
				switch(true) {
					case (fourback == ".jpg"):
					case (arg.substring(arg.length-5) == ".jpeg"):
					case (fourback == ".png"):
					case (fourback == ".bmp"):
					case (arg.substring(0,1) == '-'):
						return false;
						break;
					default:
						return true;
						break;
				}
			}
			return false;
		}
	}
	
	module.exports = self;