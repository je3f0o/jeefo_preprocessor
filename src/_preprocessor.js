/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : _preprocessor.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Preprocessor = function (parser, compiler, actions, scope, state) {
	this.state    = state || {};
	this.scope    = scope;
	this.parser   = parser;
	this.actions  = actions;
	this.compiler = compiler;
};

Preprocessor.prototype = {
	// Utils {{{1
	$new : function (token) {
		var pp = new Preprocessor(this.parser, this.compiler, this.actions, this.scope, this.state);
		if (token) {
			pp.code = this.get_code(this.code, token);
		}
		return pp;
	},

	copy : function () {
		return new Preprocessor(this.parser, this.compiler, this.actions.clone(), this.scope.clone(), this.state);
	},

	// Actions {{{1
	has_action : function (name) {
		return this.actions.handlers[name] !== void 0;
	},

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
		pp.compile(code, pp.parse(code));
	},

	define : function (name, token, ret) {
		switch (token.type) {
			case "FunctionExpression":
				var definition = this.$new(),
					i = 0, body = token.body.body;

				if (ret && ret.name !== "null" && ret.name !== "false" && ret.value !== '0') {
					for (i = 0; i < body.length; ++i) {
						if (body[i].type === "ReturnStatement") {
							definition.code   = this.get_code(this.code, body[i].argument);
							definition.tokens = this.parse(definition.code);
							break;
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
					// jshint curly : false 
					for (i = token.parameters.length - 1,
						definition.params = new this.Array(i + 1),
						definition.params[i] = token.parameters[i].name;
						i >= 0;
						definition.params[i] = token.parameters[i].name, --i);
					// jshint curly : true
				}

				this.scope.define(name, definition);
				break;
			default:
				this.scope.define(name, this.compiler.compile(token));
		}
	},

	// Compile {{{1
	compile : function (code, tokens) {
		var i = 0, j = 0, actions = [];

		this.code = code;

		for (; i < tokens.length; ++i) {
			if (this.has_action(tokens[i].type)) {
				actions[j++] = this.actions.invoke(this, tokens[i]);
			}
		}

		i = actions.length;
		while (i--) {
			this.action(actions[i]);
		}

		return this.code;
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
		return this.parser.parse(code);
	},

	get_code : function (code, token) {
		return code.substring(token.start.index, token.end.index);
	}
	// }}}1
};

module.exports = Preprocessor;
