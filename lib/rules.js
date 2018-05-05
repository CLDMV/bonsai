'use strict'

	const parent = cldmv_image_sizer;

	const self = {
		foundParseRules: [],
		parseRules: [],
		parseSelectedRules: function(rule_array) {
			if (typeof rule_array != "undefined" && rule_array) {
				if (Array.isArray(rule_array)) {
					rule_array.forEach(function(r) {
						self.parseRules.push(r);
					});
				} else {
					self.parseRules.push(rule_array);
				}
			}
		},
		process: function(config) {
			self.foundParseRules = [];
			self.parseRules = [];
			self.parseSelectedRules(config.getCLIRules());
			self.parseSelectedRules(config.rule);
			// var rule = config.getCLIRules();
			// if (typeof rule != "undefined" && rule) {
			// 	if (Array.isArray(rule)) {
			// 		rule.forEach(function(r) {
			// 			self.parseRules.push(r);
			// 		});
			// 	} else {
			// 		self.parseRules.push(rule);
			// 	}
			// }
			rule = self.parseRules;
			var rules = config.rules;
			// console.log('rule [rules:17]');
			// console.log(rule);
			// console.log('rules [rules:19]');
			// console.log(rules);
			if (Array.isArray(rule)) {
				rule.forEach(function(rule) {
					if (typeof rules[rule] == "undefined") {
						Object.keys(rules).forEach(function(r) {
							if (typeof rules[r].alias != "undefined") {
								// console.log('rules[r].alias [rules:26]');
								// console.log(rules[r].alias);
								rules[r].alias.forEach(function(e,a) {
									if (e.toLowerCase() == rule) {
										self.foundParseRules.push(rules[r]);
									}
								});
							}
						});
					} else {
						self.foundParseRules.push(rules[rule]);
					}
				});

				if (self.foundParseRules.length == 0) {
					return function () { parent.help.commands(); self.error(); };
				}

				return true;
			}
			return false;
		},
		error: function() {
			var usage = [
				''
			  , '  Usage: -r rule_name...'
			  , ''
			  , '    For examples use the -e [--example] command'
			  , ''
			  , '      Available examples:'
			  , ''
			  // , '        '
			  // , ''
			].join('\n');
			console.error(usage);
		},
		help: function() {
			var usage = [
				''
			  , '  Usage: -r rule_name...'
			  , ''
			  , '  Requirements:'
			  , ''
			  , '    Rule Values must contain one of the following sets: '
			  , '      An array of numbers (percentages)'
			  , '        Example:'
			  , '          ['
			  , '            50,'
			  , '            25'
			  , '          ]'
			  , ''
			  , '      An array of objects (width x height)'
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
			  , '      An array of arrays (width x height)'
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
			].join('\n');
			console.error(usage);
		}
	}

	module.exports = self;
