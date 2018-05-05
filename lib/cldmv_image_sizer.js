'use strict'

	const self = {
		help: require('./help.js'),
		config: require('./config.js'),
		rules: require('./rules.js'),
		image: require('./image.js'),
		run: function() {
			if (!self.config.process()) {
				self.help.commands();
				return;
			} else {
				var success = self.rules.process(self.config.getCurrentConfig());
				if (!success) {
					self.help.commands();
					return;
				} else {
					if (typeof success == "function") {
						success();
						return;
					}
					success = self.image.run();

					if (!success) {
						self.help.commands();
						return;
					} else {
						if (typeof success == "function") {
							success();
							return;
						}
					}
				}
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
