/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2017-04-29
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Scope                  = require("./src/scope"),
	parser                 = require("jeefo_javascript_parser/src/es5_parser"),
	actions                = require("./src/actions/es5"),
	compiler               = require("jeefo_javascript_beautifier"),
	Indentation            = require("./src/indentation"),
	JavascriptPreprocessor = require("./src/preprocessor"),

	indent       = new Indentation('', '\t'),
	scope        = new Scope(null, indent),
	preprocessor = new JavascriptPreprocessor(parser, compiler, actions, scope);

preprocessor.pre_define("IS_NULL"      , function (x) { return x === null;   }, true);
preprocessor.pre_define("IS_DEFINED"   , function (x) { return x !== void 0; }, true);
preprocessor.pre_define("IS_UNDEFINED" , function (x) { return x === void 0; }, true);

preprocessor.pre_define("IS_NUMBER"   , function (x) { return typeof x === "number";   } , true);
preprocessor.pre_define("IS_STRING"   , function (x) { return typeof x === "string";   } , true);
preprocessor.pre_define("IS_BOOLEAN"  , function (x) { return typeof x === "boolean";  } , true);
preprocessor.pre_define("IS_FUNCTION" , function (x) { return typeof x === "function"; } , true);

preprocessor.pre_define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);

preprocessor.pre_define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) !== -1; } , true);

preprocessor.pre_define("IS_JEEFO_PROMISE" , function (x) { return x && x.type === "JEEFO_PROMISE"; } , true);
preprocessor.pre_define("ARRAY_LAST", function (arr) { return arr[arr.length - 1]; }, true);

var es6_pp = preprocessor.clone();
es6_pp.parser  = require("jeefo_javascript_parser/src/es6_parser");
es6_pp.actions = require("./src/actions/es6");

module.exports = {
	es5 : preprocessor,
	es6 : es6_pp
};

/*
var code = `
PP.define("ASSIGN_TEN", function (x) { return x = 10; }, true);

ASSIGN_TEN(dynamic_var);`;

console.log(preprocessor.process("In memory", code));
*/
