'use strict'

	const 	fs = require('fs'),
			process_path = require('path'),
			jimp = require("jimp");

	var images = [];
	var sizes = {};

	function isNumeric(num){
		return !isNaN(num)
	}

	const parent = cldmv_image_sizer;

	var run_tinify = false;

	const self = {
		current_config: {},
		updateCurrentConfig: function(path) {
			self.current_config = parent.config.prependConfig(path);
		},
		run: function() {
			var found_rules = parent.config.getFoundParseRules();

			if (found_rules.length > 0) {
				found_rules.forEach(function(found_rule,k) {
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
								parent.rules.help();
								break;
						}
					});
				});
				parent.config.getFiles().forEach(function(file) {
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
		},

		png: {
			isInterlaced: function(file) {
				let fd
				try {
					var buf = new Buffer(1);
					fd = fs.openSync(file, 'r+');
					var bytes = fs.readSync(fd, buf, 0, buf.length, 28);
					// Print only read bytes to avoid junk.
					if(bytes > 0){
						var slice = buf.slice(0, bytes);
						if (slice.toString().charCodeAt() != 0) {
							// fs.closeSync(fd);
							return true;
						}
					}
				} catch (e) {
				    return console.error('Error:', e);
				} finally {
					if (fd !== undefined) {
						fs.closeSync(fd);
					}
				}
				return false;
			}
		},
		processNewImageName: function(new_image_path, k) {
			var regex_searches = {
				'{REPLACE_ME_PREFIX}': [
					"([\-\_])" + k
				],
				'{REPLACE_ME_SUFFIX}': [
					k + "([\-\_])"
				],
				'{REPLACE_ME_BOTH}': [
					"([\-\_])" + k + "([\-\_])"
				],
				'{REPLACE_ME_PERCENT}': [
					"([\-\_])?[0-9]+([\-\_]|)?(percent)"
				],
				'{REPLACE_ME}': [
					k,
					"([\-\_])?[0-9]+x[0-9]+([\-\_])?"
				],
			};

			var prepend_size = true;

			Object.keys(regex_searches).forEach(function(r) {
				var a = regex_searches[r];
				a.forEach(function(aa) {
					var regex = new RegExp(aa,"gi");
					var found = new_image_path.match(regex);
					if (found) {
						new_image_path = new_image_path.replace(regex,r);
						prepend_size = false;
					}
				});
			});

			var regex = false;

			if (prepend_size) {
				var insert = k;
				if (k.indexOf('x') == -1) {
					insert = k + '-percent';
				}
				var search = "\\.\\w{3,4}$";
				regex = new RegExp(search,"gi");
				var found = new_image_path.match(regex);
				if (found) {
					var ext = process_path.extname(new_image_path);
					regex = new RegExp(search,"gi");
					new_image_path = new_image_path.replace(regex,'-'+insert+'.'+ext);
				}
			} else {
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
			}

			// clean up possible -. or _. or .. strings
			regex = new RegExp("([\-\_\.])?\\.","gi");
			new_image_path = new_image_path.replace(regex,'.');
			return new_image_path;
		},
		processImage: function(image_path) {
			var next = images.shift();
			if (fs.existsSync(image_path)) {
				jimp.read(image_path,function(err, base_image) {
					if (err) throw err;

					parent.print('Processing file: ' + image_path);
					Object.keys(sizes).forEach(function(k) {
						var image = base_image.clone();
						var size = sizes[k];
						if (k.indexOf('x') != -1) {
							parent.print('  Processing size: ' + k);
						} else {
							parent.print('  Processing size: ' + k + '%');
						}

						switch(true) {
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

						var dir = process_path.dirname(image_path);
						var new_image_path = process_path.basename(image_path);
						new_image_path = self.processNewImageName(new_image_path,k);
						// console.log(new_image_path);
						var new_path = process_path.join(dir, self.config.relative_save_path, new_image_path);
						image.write(new_path);
						parent.print('    Saved as: ' + new_path);
					});
					if (typeof next != "undefined") {
						self.processImage(next);
					}
				});
			} else {
				parent.print('File not found: '+image_path);
			}
		},
	}

	module.exports = self;
