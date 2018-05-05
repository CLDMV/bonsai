'use strict'

	const 	fs = require('fs'),
			process_path = require('path'),
			deepmerge = require('deepmerge');

	const default_config = require("../.image-sizer.json");

	var parse_rules = [],
		found_parse_rules = [],
		parse_path = [],
		files = [],
		cli_rules = [],
		print = false;

	const self = {
		tinify: {
			enabled: false,
			api_key: ''
		},
		rules: [],
		rule: false,
		relative_save_path: './converted',
		// default_rule: false,
		print: false,
		path: [],
		enablePrint: function() {
			print = true;
		},
		enableTinify: function(api_key) {
			self.tinify.enabled = true;
			if (typeof api_key != "undefined") {
				self.tinify.api_key = api_key;
			}
		},
		addFile: function(file) {
			files.push(file);
		},
		getFiles: function() {
			return files;
		},
		addCLIRule: function(rule) {
			cli_rules.push(rule);
		},
		getCLIRules: function() {
			return cli_rules;
		},
		// addParseRule: function(rule) {
		// 	parse_rules.push(rule);
		// },
		// getParseRules: function() {
		// 	return parse_rules;
		// },
		// addFoundParseRule: function(rule) {
		// 	found_parse_rules.push(rule);
		// },
		// getFoundParseRules: function() {
		// 	return found_parse_rules;
		// },
		addNewParsePath: function(path) {
			parse_path.push(path);
		},
		getParsePaths: function() {
			return parse_path;
		},
		normalizerules: function(rules) {
			var tmprules = {};
			Object.keys(rules).forEach(function(r) {
				tmprules[r.toLowerCase()] = rules[r];
				r = r.toLowerCase();

				if (typeof tmprules[r].values == "undefined") {
					console.error('r');
					console.error(r);
					console.error('tmprules');
					console.error(tmprules);
					console.error('rules');
					console.error(rules);
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
			rules = tmprules;
			return rules;
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
		getCurrentConfig: function() {
			var tmp_config = {};
			Object.keys(self).forEach(function(r) {
				if (typeof self[r] != "symbol" && typeof self[r] != "function") {
					tmp_config[r] = self[r];
				}
			});
			return tmp_config;
		},
		mergeconfig: function(new_config) {
			var tmp_config = self.getCurrentConfig();

			tmp_config = deepmerge(tmp_config, default_config);

			tmp_config = self.normalizeRule(tmp_config);

			tmp_config = self.loadConfigs(tmp_config.path, tmp_config);

			tmp_config = self.loadConfigs(parse_path, tmp_config);

			// reset print setting to command line option if present.
			tmp_config.print = self.print = print || tmp_config.print || self.print;

			Object.keys(self).forEach(function(r) {
				if (typeof self[r] != "undefined" && typeof self[r] != "symbol" && typeof self[r] != "function") {
					self[r] = tmp_config[r];
				}
			});

			self.rules = self.normalizerules(self.rules);
		},
		prependConfig: function(path) {
			var tmp_config = self.getCurrentConfig();
			tmp_config = self.addConfig(path, tmp_config);
			tmp_config = self.normalizeRule(tmp_config);
			tmp_config.rules = self.normalizerules(tmp_config.rules);
			return tmp_config;
		},
		process: function(new_config) {
			self.addNewParsePath('.image-sizer.json');
			self.mergeconfig(new_config);
			if (files.length > 0) {
				return true;
			}
			return false;
		}
	}

	module.exports = self;
