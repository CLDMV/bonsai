'use strict'

	const 	fs = require('fs'),
			deepmerge = require('deepmerge');
			
	const default_config = require("../.image-sizer.json");
	
	const self = {
		rules: [],
		rule: false,
		default_rule: false,
		print: false,
		path: process.cwd() + "/.image-sizer.json",
		normalizerules: function() {			
			var tmprules = {};
			Object.keys(self.rules).forEach(function(r) {
				tmprules[r.toLowerCase()] = self.rules[r];
			});
			self.rules = tmprules;
		},
		mergeconfig: function() {
			var tmp_config = {};
			Object.keys(self).forEach(function(r) {
				if (typeof self[r] != "symbol" && typeof self[r] != "function") {
					tmp_config[r] = self[r];
				}
			});
			tmp_config = deepmerge(tmp_config, default_config);
			
			var working_config = {};

			if (fs.existsSync(self.path)) {
				working_config = require(self.path);
			}

			if (typeof working_config.rules != "undefined") {
				tmp_config = deepmerge(tmp_config, working_config);
			} else {
				tmp_config = deepmerge(tmp_config, {});
				if (typeof working_config.type != "undefined") {
					tmp_config.rules = deepmerge(tmp_config.rules, working_config);
				} else {
					var t = working_config;
					working_config = {
						"tmp": t
					};
					tmp_config.rules = deepmerge(tmp_config.rules, working_config);
				}
			}
			
			Object.keys(self).forEach(function(r) {
				if (typeof self[r] != "undefined" && typeof self[r] != "symbol" && typeof self[r] != "function") {
					switch(r) {
						case 'rule':
							break;
						default:
							self[r] = tmp_config[r];
							break;
					}
				}
			});
			if (self.default_rule && !self.rule) {
				self.rule = self.default_rule;
			}
			self.normalizerules();
		},
		process: function(example) {
			self.mergeconfig();
			
			// if (this.rule) {
				// this.rule = rule.toLowerCase();
				// return true;
			// }
			return true;
		}
	}
	
	module.exports = self;