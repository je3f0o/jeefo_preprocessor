/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : preprocessor.js
* Created at  : 2017-04-26
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var JavascriptPreprocessor = function (parser, compiler, actions, scope, state) {
	this.state    = state || {};
	this.scope    = scope;
	this.parser   = parser;
	this.actions  = actions;
	this.compiler = compiler;
};

JavascriptPreprocessor.prototype = {
	// Utils {{{1
	$new : function (token) {
		var pp = new JavascriptPreprocessor(this.parser, this.compiler, this.actions, this.scope, this.state);
		if (token) {
			pp.code = this.get_code(this.code, token);
		}
		return pp;
	},

	clone : function () {
		return new JavascriptPreprocessor(this.parser, this.compiler, this.actions.clone(), this.scope.clone(), this.state);
	},

	// Actions {{{1
	action : function (action) {
		if (action) {
			switch (action.type) {
				case "replace" :
					this.code = `${ this.code.substr(0, action.start) }${ action.value }${ this.code.substr(action.end) }`;
					return true;
				case "remove" :
					this.code = `${ this.code.substr(0, action.start) }${ this.code.substr(action.end) }`;
					return true;
			}
		}
	},

	remove : function (token) {
		return {
			type  : "remove",
			start : token.start.index,
			end   : token.end.index,
		};
	},

	replace : function (token, value) {
		return {
			type  : "replace",
			start : token.start.index,
			end   : token.end.index,
			value : value
		};
	},

	// Define {{{1
	pre_define : function (name, definition, is_return) {
		var pp   = this.$new(),
			code = `PP.define("${ name }", ${ definition.toString() }, ${ is_return });`;

		pp.scope = this.scope;
		pp.process("[IN MEMORY]", code);
	},

	define : function (name, token, ret) {
		switch (token.type) {
			case "FunctionExpression":
				var definition = this.$new(),
					i = 0, body = token.body.body;

				if (ret) {
					switch (ret.type) {
						case "NullLiteral" :
							ret = false;
							break;
						case "NumberLiteral" :
							if (ret.value === "0") {
								ret = false;
							}
							break;
						case "BooleanLiteral" :
							if (ret.value === "false") {
								ret = false;
							}
							break;
						default:
							console.log("WHAT IS PP.define() 3rd argument ?");
							console.log(ret);
							process.exit();
					}

					if (ret) {
						for (i = 0; i < body.length; ++i) {
							if (body[i].type === "ReturnStatement") {
								definition.code   = this.get_code(this.code, body[i].argument);
								definition.tokens = this.parse(definition.code);
								break;
							}
						}
					}
				} else {
					definition.code = this.code.substr(
						body[0].start.index,
						body[body.length - 1].end.index - body[0].start.index
					);
					definition.tokens = this.parse(definition.code);
				}

				if (token.parameters.length) {
					i                 = token.parameters.length;
					definition.params = [];
					while (i--) {
						definition.params[i] = token.parameters[i].name;
					}
				}

				this.scope.define(name, definition);
				break;
			default:
				this.scope.define(name, this.compiler.compile(token));
		}
	},

	// Processor {{{1
	process_tokens : function (code, tokens) {
		var actions = [], i = 0;

		this.code = code;

		for (; i < tokens.length; ++i) {
			actions[i] = this.actions.invoke(this, tokens[i]);
		}

		i = actions.length;
		while (i--) {
			this.action(actions[i]);
		}

		return this.code;
	},

	process : function (filename, code) {
		return this.process_tokens(code, this.parser.parse(code));
	},

	// Parser {{{1
	parse : function (code) {
		try {
			return this.parser.parse(code);
		} catch(e) {
			console.log("E", e);
			console.log(code);
			process.exit();
		}
	},

	get_code : function (code, token) {
		return code.substring(token.start.index, token.end.index);
	}
	// }}}1
};

module.exports = JavascriptPreprocessor;
