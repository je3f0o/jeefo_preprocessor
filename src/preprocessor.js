/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : preprocessor.js
* Created at  : 2017-04-26
* Updated at  : 2017-05-09
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

/* globals */
/* exported */

module.exports = function (jeefo) {

//ignore:end

jeefo.module("jeefo_preprocessor", ["jeefo_javascript_beautifier"]).

// JeefoObject {{{1
namespace("JeefoObject", [
	"Array",
	"object.assign",
], function (Array, assign) {
	var JeefoObject = function () {};
	JeefoObject.prototype = {
		Array       : Array,
		assign      : assign,
		JeefoObject : JeefoObject,
		$new : function () {
			return new this.JeefoObject();
		},
		$copy : function () {
			return this.assign(new this.JeefoObject(), this);
		},
	};
	JeefoObject.create = function (object) {
		return assign(new JeefoObject(), object);
	};
	return JeefoObject;
}).

// Indentation {{{1
namespace("preprocessor.Indentation", function () {

	var Indentation = function (space, indentation) {
		this.space       = space;
		this.indentation = indentation;
	};

	Indentation.prototype = {
		Indentation : Indentation,

		copy : function () {
			return new this.Indentation(this.space, this.indentation);
		},

		indent : function () {
			return new this.Indentation(`${ this.space }${ this.indentation }`, this.indentation);
		},

		outdent : function () {
			return new this.Indentation(
				this.space.substring(0, this.space.length - this.indentation.length),
				this.indentation
			);
		},
	};

	return Indentation;
}).

// Scope {{{1
namespace("preprocessor.Scope", [
	"JeefoObject",
], function (JeefoObject) {
	var Scope = function (parent, indent) {
		this.parent = parent;
		this.indent = indent;

		if (parent) {
			this.defines = this.JeefoObject.create(parent.defines);
		} else {
			this.defines = new this.JeefoObject();
		}
	};

	Scope.prototype = {
		Scope       : Scope,
		JeefoObject : JeefoObject,

		$new : function () {
			return new this.Scope(this, this.indent.indent());
		},

		copy : function () {
			return new this.Scope(this, this.indent.copy());
		},

		has : function (name) {
			return this.defines.hasOwnProperty(name);
		},

		define : function (name, definition) {
			this.defines[name] = definition;
		}
	};

	return Scope;
}).

// Actions {{{1
namespace("preprocessor.Actions", [
	"JeefoObject",
], function (JeefoObject) {

	var Actions = function (handlers) {
		this.handlers = this.JeefoObject.create(handlers);
	};

	Actions.prototype = {
		Actions     : Actions,
		JeefoObject : JeefoObject,

		$copy : function () {
			return new this.Actions(this.handlers);
		},

		has : function (name) {
			return this.handlers.hasOwnProperty(name);
		},

		register : function (name, handler) {
			this.handlers[name] = handler;
			return this;
		},

		invoke : function (pp, token) {
			return this.handlers[token.type](pp, token);
		}
	};

	return Actions;
}).

// Preprocessor {{{1
namespace("javascript.Preprocessor", [
	"Array",
], function (Array) {

	// Preprocessor {{{2
	var Preprocessor = function (parser, compiler, actions, scope, state) {
		this.state    = state,
		this.scope    = scope;
		this.parser   = parser;
		this.actions  = actions;
		this.compiler = compiler;
	};
	// Prototypes {{{2
	Preprocessor.prototype = {
		// Utils {{{3
		Array        : Array,
		Preprocessor : Preprocessor,

		$new : function () {
			return new this.Preprocessor(this.parser, this.compiler, this.actions, this.scope, this.state);
		},

		copy : function () {
			return new this.Preprocessor(this.parser, this.compiler, this.actions, this.scope.copy());
		},

		// Actions {{{3
		has_action : function (name) {
			return this.actions.handlers.hasOwnProperty(name);
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

		// Define {{{3
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

					// jshint curly : false
					for (i = token.parameters.length - 1,
						definition.params = new this.Array(i + 1),
						definition.params[i] = token.parameters[i].name;
						i >= 0;
						definition.params[i] = token.parameters[i].name, --i);
					// jshint curly : true

					this.scope.define(name, definition);
					break;
				default:
					this.scope.define(name, this.compiler.compile(token));
			}
		},

		// Compile {{{3
		compile : function (code, tokens) {
			var actions = new this.Array(tokens.length),
				i = 0, j = 0;

			this.code = code;

			for (; i < tokens.length; ++i) {
				if (this.actions.has(tokens[i].type)) {
					actions[j++] = this.actions.invoke(this, tokens[i]);
				}
			}

			for (i = actions.length - 1; i >= 0; --i) {
				this.action(actions[i]);
			}

			return this.code;
		},

		// Parser {{{3
		parse : function (code) {
			return this.parser.parse(code);
		},

		get_code : function (code, token) {
			return code.substr(token.start.index, token.end.index - token.start.index);
		}
		// }}}3
	};
	// }}}2

	return Preprocessor;
}).

// Pre defined actioins {{{1
namespace("preprocessor.actions", [
	"preprocessor.Actions",
], function (Actions) {

	var actions = new Actions();

	// Variable declaration {{{2
	actions.register("VariableDeclaration", function (pp, token) {
		var code         = pp.get_code(pp.code, token),
			declarations = pp.parse(code, token)[0].declarations,
			i = 0, j = 0, actions = [], has_action;

		pp      = pp.$new();
		pp.code = code;

		for (; i < declarations.length; ++i) {
			if (declarations[i].init) {
				if (pp.actions.has(declarations[i].init.type)) {
					actions[j++] = pp.actions.invoke(pp, declarations[i].init);
				}
			}
		}

		for (i = actions.length - 1; i >= 0; --i) {
			if (! has_action) {
				has_action = pp.action(actions[i]);
			} else {
				pp.action(actions[i]);
			}
		}

		if (has_action) {
			return pp.replace(token, pp.code);
		}
	}).

	// Identifier {{{2
	register("Identifier", function (pp, token) {
		if (pp.scope.has(token.name)) {
			return pp.replace(token, pp.scope.defines[token.name]);
		}
	}).

	// Member Expression {{{2
	register("MemberExpression", function (pp, token) {
		
	}).

	// Comment {{{2
	register("Comment", function (pp, token) {
		
	}).

	// Expression statement {{{2
	register("ExpressionStatement", function (pp, token) {
		if (pp.has_action(token.expression.type)) {
			var action = pp.actions.invoke(pp, token.expression);
			if (action && action.type === "remove") {
				action.end = token.end.index;
				return action;
			}
		}
	}).

	// Return statement {{{2
	register("ReturnStatement", function (pp, token) {
	}).

	// Binary Expression {{{2
	register("BinaryExpression", function (pp, token) {
		var code       = pp.get_code(pp.code, token),
			actions    = new this.Array(2),
			expression = pp.parse(code, token)[0].expression, has_action;

		pp      = pp.$new();
		pp.code = code;

		if (pp.has_action(expression.left.type)) {
			actions[0] = pp.actions.invoke(pp, expression.left);
		}
		if (pp.has_action(expression.right.type)) {
			actions[1] = pp.actions.invoke(pp, expression.right);
		}

		has_action = pp.action(actions[0]);
		if (! has_action) {
			has_action = pp.action(actions[1]);
		}

		if (has_action) {
			return pp.replace(token, pp.code);
		}
	}).

	// Call Expression {{{2
	register("CallExpression", function (pp, token) {
		switch (token.callee.type) {
			case "MemberExpression" :
				if (token.callee.object.name === "PP" && token.callee.property.name === "define") {
					pp.define(
						token["arguments"][0].value,
						token["arguments"][1],
						token["arguments"][2]
					);
					return pp.remove(token);
				}
				break;
			case "Identifier":
				if (pp.scope.has(token.callee.name)) {
					var def = pp.scope.defines[token.callee.name],
						i   = def.params.length - 1;

					pp = def.copy();

					for (; i >= 0; --i) {
						pp.define(def.params[i], token["arguments"][i]);
					}

					return pp.replace(token, pp.compile(def.code, def.tokens));
				}
		}
	});
	// }}}2

	return actions;
}).

// Public API {{{1
namespace("javascript.ES5_preprocessor", [
	"javascript.ES5_parser",
	"javascript.Preprocessor",
], function (parser, JavascriptPreprocessor) {

	return;
	var PublicJavascriptPreprocessor = function (defs, middlewares) {
		this.pp          = new JavascriptPreprocessor({}, defs);
		this.scope       = this.pp.scope;
		this.middlewares = middlewares || [];
	},
	p = PublicJavascriptPreprocessor.prototype;
	p.Scope                  = JavascriptPreprocessor.prototype.Scope;
	p.parser                 = parser;
	p.JavascriptPreprocessor = JavascriptPreprocessor;

	p.define = function (name, definition, is_return) {
		var code = `PP.define(${ name }, ${ definition.toString() }, ${ is_return });`;
		var file = parser("[IN MEMORY]", code);

		this.pp.compiler.current_indent = '';

		this.scope = new this.Scope(null, this.scope.defs);
		this.pp.process(file.program.body, this.scope);
	};

	p.$new = function () {
		return new PublicJavascriptPreprocessor(this.scope.defs, this.middlewares.concat());
	};

	p.middleware = function (middleware) {
		this.middlewares.push(middleware);
	};

	p.get_defs = function (defs) {
		return new this.Scope(this.scope, defs).defs;
	};

	p.process = function (filename, source_code, defs, indent, indentation) {
		var i    = 0,
			file = this.parser(filename, source_code),
			pp   = new this.JavascriptPreprocessor(file, this.get_defs(defs), indent, indentation);

		for (; i < this.middlewares.length; ++i) {
			this.middlewares[i](pp);
		}

		pp.process(file.program.body, pp.scope);
		pp.actions.sort(function (a, b) { return a.start - b.start; });

		for (i = pp.actions.length - 1; i >= 0; --i) {
			switch (pp.actions[i].type) {
				case "remove":
					pp.remove(pp.actions[i]);
					break;
				case "replace":
					pp.replace_between(pp.actions[i]);
					break;
			}
		}

		return pp.result;
	};

	var instance = new PublicJavascriptPreprocessor();

	instance.define("IS_NULL"      , function (x) { return x === null;   }, true);
	instance.define("IS_DEFINED"   , function (x) { return x !== void 0; }, true);
	instance.define("IS_UNDEFINED" , function (x) { return x === void 0; }, true);

	instance.define("IS_NUMBER"   , function (x) { return typeof x === "number";   } , true);
	instance.define("IS_STRING"   , function (x) { return typeof x === "string";   } , true);
	instance.define("IS_BOOLEAN"  , function (x) { return typeof x === "boolean";  } , true);
	instance.define("IS_FUNCTION" , function (x) { return typeof x === "function"; } , true);

	instance.define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);

	instance.define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);
	instance.define("ARRAY_NOT_EXISTS" , function (arr, x) { return arr.indexOf(x) === -1; } , true);

	instance.define("IS_JEEFO_PROMISE" , function (x) { return x && x.type === "JEEFO_PROMISE"; } , true);

	return instance;
});
// }}}1

// ignore:start
// Debug {{{1
};

if (require.main === module) {

var jeefo = require("jeefo").create();

jeefo.use(require("jeefo_core"));
jeefo.use(require("jeefo_tokenizer"));
jeefo.use(require("jeefo_javascript_parser"));
jeefo.use(require("jeefo_javascript_beautifier"));

jeefo.use(module.exports);

var pp = jeefo.module("jeefo_preprocessor");

pp.run([
	"preprocessor.Scope",
	"preprocessor.actions",
	"preprocessor.Indentation",
	"javascript.ES5_parser",
	"javascript.Beautifier",
	"javascript.Preprocessor",
], function (Scope, actions, Indentation, es5_parser, JavascriptBeautifier, JavascriptPreprocessor) {

	var source = `
		var z = IS_UNDEFINED(value);
		var fff = fff;
	`;

	var parser   = {
			parse : function (code) {
				return es5_parser("[IN MEMORY]", code).program.body;
			}
		},
		indent   = new Indentation('', '\t'),
		scope    = new Scope(null, indent),
		compiler = new JavascriptBeautifier(),
		pp       = new JavascriptPreprocessor(parser, compiler, actions, scope);

	var define_from_string = function (name, str) {
		var token = es5_parser("[IN MEMORY]", str).program.body[0];
		pp.define(name, token.expression);
	};

	define_from_string("fff", "complicated[computed[x]]");

	pp.pre_define("IS_NULL"      , function (x) { return x === null;   }, true);
	pp.pre_define("IS_DEFINED"   , function (x) { return x !== void 0; }, true);
	pp.pre_define("IS_UNDEFINED" , function (x) { return x === void 0; }, true);

	pp.pre_define("IS_NUMBER"   , function (x) { return typeof x === "number";   } , true);
	pp.pre_define("IS_STRING"   , function (x) { return typeof x === "string";   } , true);
	pp.pre_define("IS_BOOLEAN"  , function (x) { return typeof x === "boolean";  } , true);
	pp.pre_define("IS_FUNCTION" , function (x) { return typeof x === "function"; } , true);

	pp.pre_define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);

	pp.pre_define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);
	pp.pre_define("ARRAY_NOT_EXISTS" , function (arr, x) { return arr.indexOf(x) === -1; } , true);

	pp.pre_define("IS_JEEFO_PROMISE" , function (x) { return x && x.type === "JEEFO_PROMISE"; } , true);

	var c = pp.compile(source, pp.parse(source));
	console.log(c);

	/*
	var fs = require("fs"),
		path = require("path");
	
	var filename = path.join(__dirname, "./javascript_preprocessor.js");
	filename = path.join(__dirname, "../node_modules/jeefo_javascript_parser/src/javascript_parser.js");
	var source = fs.readFileSync(filename, "utf8");


	try {
		var start = Date.now();
		var code = pp.process("[IN MEMORY]", source);
		var end = Date.now();

		console.log("-------------------------------");
		console.log(`Preprocessor in: ${ (end - start) }ms`);
		console.log("-------------------------------");

		console.log(code);
	} catch (e) {
		console.error("ERROR:", e);
		console.log(e.$stack);
		console.log(e.stack);
	}
	*/
});

}

// }}}1
// ignore:end
