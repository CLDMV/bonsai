'use strict'

	const self = {
		help: require('./help.js'),
		config: require('./config.js'),
		rules: require('./rules.js'),
		run: function() {			
			if (!self.config.process()) {
				self.help.commands();
				return;
			} else {
				if (!self.rules.process()) {
					self.help.commands();
					return;
				} else {
					var found_rules = self.config.getFoundParseRules();
					
					if (found_rules.length > 0) {
						// console.log('found_rules');
						// console.log(found_rules);
						var sizes = {};
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
						Object.keys(sizes).forEach(function(k) {
							var size = sizes[k];
							
							// cldmv_image_sizer.print([
								  // 'Reading Config file:'
								// , '  '+path
								// , ''
							// ], true);
						});
					} else {
						return;		
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
	}
	
	module.exports = self;