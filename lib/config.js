'use strict'

	const 	fs = require('fs'),
			process_path = require('path'),
			deepmerge = require('deepmerge');
			
	const default_config = require("../.image-sizer.json");
	
	var parse_rules = [],
		found_parse_rules = [],
		parse_path = [],
		files = [],
		print = false;
	
	const self = {
		rules: [],
		rule: false,
		relative_save_path: './converted',
		// default_rule: false,
		print: false,
		path: [],
		enablePrint: function() {
			print = true;
		},
		addFile: function(file) {
			files.push(file);
			console.log(files);
		},
		getFiles: function() {
			return files;
		},
		addParseRule: function(rule) {
			parse_rules.push(rule);
		},
		getParseRules: function() {
			return parse_rules;
		},
		addFoundParseRule: function(rule) {
			found_parse_rules.push(rule);
		},
		getFoundParseRules: function() {
			return found_parse_rules;
		},
		addNewParsePath: function(path) {
			parse_path.push(path);
		},
		getParsePaths: function() {
			return parse_path;
		},
		normalizerules: function() {			
			var tmprules = {};
			Object.keys(self.rules).forEach(function(r) {
				tmprules[r.toLowerCase()] = self.rules[r];
				r = r.toLowerCase();
				
				// console.error('r');
				// console.error(r);
				// console.error('tmprules');
				// console.error(tmprules);
				// console.error('self.rules');
				// console.error(self.rules);
				if (typeof tmprules[r].values == "undefined") {
					console.error('r');
					console.error(r);
					console.error('tmprules');
					console.error(tmprules);
					console.error('self.rules');
					console.error(self.rules);
				}
				tmprules[r].values.forEach(function(v,i){
					if (typeof v == "object" && Array.isArray(v)) {
						tmprules[r].values[i] = {
							"x": v[0],
							"y": v[1] || false
						}
					}
				});
			});
			self.rules = tmprules;
		},
		addConfig: function(path, tmp_config) {
			var working_config = {};

			if (fs.existsSync(path)) {
				working_config = require(path);
				working_config = self.normalizeRule(working_config);
				var basename = process_path.basename(path);
				// console.log('working_config ['+basename+']');
				// console.log(working_config);
				
				switch(true) {
					case (typeof working_config.rules != "undefined"):
						// v1 + of config files
						tmp_config = deepmerge(tmp_config, working_config);
						break;
					case (typeof working_config.type != "undefined"):
						// singular rule config file
						working_config = {
							"rules": working_config
						};
						tmp_config = deepmerge(tmp_config, working_config);
						break;
					case (typeof working_config == "object" && Array.isArray(working_config)):
						// singular unnamed rule
						// could be pixel or percent set
						var basename = process_path.basename(path);
						var rule_name = basename.replace(/\.image-sizer-/i, '');
							rule_name = rule_name.replace(/\.json/i, '');
							
						var t = {
							"rules": {}
						};
						t.rules[rule_name] = {
							"values": working_config
						};
						
						if (typeof working_config[0] == "object") {
							// Pixel settings
							t.rules[rule_name].type = 'px';
						} else {
							// percent settings
							t.rules[rule_name].type = 'percent';
						}
						working_config = t;
						break;
					default:
						// Set of Rules
						var t = working_config;
						working_config = {
							"rules": working_config
						};
						// console.log('==t==');
						// console.log(t);
						// console.log('==tmp_config==');
						// console.log(tmp_config);
						// console.log('==working_config==');
						// console.log(working_config);
						tmp_config = deepmerge(tmp_config, working_config);
						break;
				}
			}

			// console.log('==tmp_config==');
			// console.log(tmp_config);
			return tmp_config;
		},
		normalizeRule: function(tmp_config) {
			if (tmp_config.rule && typeof tmp_config.rule == "string") {
				var r = tmp_config.rule;
				tmp_config.rule = [];
				tmp_config.rule.push(r);
			}
			return tmp_config;
		},
		loadConfigs: function(paths, tmp_config) {
			if (typeof paths != "undefined") {
				paths.forEach(function(path) {
					if (!process_path.isAbsolute(path)) {
						path = process.cwd() + '/./' + path;
					}
					path = process_path.normalize(path);
					
					cldmv_image_sizer.print([
						  'Reading Config file:'
						, '  '+path
						, ''
					], true);
					
					tmp_config = self.addConfig(path, tmp_config);
				});
			}
			return tmp_config;
		},
		mergeconfig: function(new_config) {
			var tmp_config = {};
			Object.keys(self).forEach(function(r) {
				if (typeof self[r] != "symbol" && typeof self[r] != "function") {
					tmp_config[r] = self[r];
				}
			});
			tmp_config = deepmerge(tmp_config, default_config);
			
			tmp_config = self.normalizeRule(tmp_config);
			
			tmp_config.print = self.print = print || tmp_config.print || self.print;
			
			// console.log('----------------------');
			// console.log('----------------------');
			// console.log('self.print');
			// console.log(self.print);
			// console.log('----------------------');
			// console.log('new_config');
			// console.log(new_config);
			// console.log('----------------------');
			// console.log('tmp_config');
			// console.log(tmp_config);
			// console.log('----------------------');
			// console.log('self.path');
			// console.log(self.path);
			// console.log('----------------------');
			// console.log('new_config.path');
			// console.log(new_config.path);
			// console.log('----------------------');
			// console.log('----------------------');
			
			tmp_config = self.loadConfigs(tmp_config.path, tmp_config);
			
			tmp_config = self.loadConfigs(parse_path, tmp_config);
			
			// if (parse_rules.length > 0) {
				// parse_rules.forEach(function(rules) {
					// var new_config = {
						// "rules": rules
					// }
					// console.log('----------------------');
					// console.log('new_config');
					// console.log(new_config);
					// console.log('----------------------');
					// new_config = self.normalizeRule(new_config);
					// tmp_config = deepmerge(tmp_config, new_config);
				// });
			// }
			


			Object.keys(self).forEach(function(r) {
				if (typeof self[r] != "undefined" && typeof self[r] != "symbol" && typeof self[r] != "function") {
					self[r] = tmp_config[r];
				}
			});
			
			self.normalizerules();
		},
		process: function(new_config) {
			self.mergeconfig(new_config);
			if (files.length > 0) {
				return true;
			}
			return false;
		}
	}
	
	module.exports = self;