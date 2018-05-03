'use strict'

	const self = {
		process: function() {
			var rule = cldmv_image_sizer.config.rule;
			if (typeof rule != "undefined" && rule) {
				if (Array.isArray(rule)) {
					rule.forEach(function(r) {
						cldmv_image_sizer.config.addParseRule(r);
					});
				} else {
					cldmv_image_sizer.config.addParseRule(rule);
				}
			}
			rule = cldmv_image_sizer.config.getParseRules();
			var rules = cldmv_image_sizer.config.rules;
			// console.log('rule [rules:17]');
			// console.log(rule);
			// console.log('rules [rules:19]');
			// console.log(rules);
			if (Array.isArray(rule)) {
				rule.forEach(function(rule) {
					if (typeof rules[rule] == "undefined") {
						Object.keys(rules).forEach(function(r) {
							if (typeof rules[r].alias != "undefined") {
								rules[r].alias.forEach(function(e,a) {
									if (e.toLowerCase() == rule) {
										cldmv_image_sizer.config.addFoundParseRule(rules[r]);
									}
								});
							}
						});
					} else {
						cldmv_image_sizer.config.addFoundParseRule(rules[rule]);
					}
				});
				
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
			  , '        '
			  , ''
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