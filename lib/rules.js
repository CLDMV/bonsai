'use strict'

	const 	fs = require('fs'),
			deepmerge = require('deepmerge');
			
	const p = {
		process: function(config) {
			if (config.rule) {
				console.log('rule');
				console.log(rule);
				
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
					var sizes = [];
					found_rule.values.forEach(function(r) {
						if (typeof r == "number") {
							
						} else {
							if (typeof r.x != "undefined" && typeof r.y != "undefined") {
							} else {
								if (Array.isArray(r) && r.length == 2) {
									
								} else {
									error_rules();
									return;
								}
							}
						}
					});
				} else {
					return false;		
				}
				
				return true;
			}
			return false;
		}
	}
	
	module.exports = p;