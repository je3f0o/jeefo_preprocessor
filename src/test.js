/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test.js
* Created at  : 2017-08-19
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Scope                  = require("./scope"),
	parser                 = require("jeefo_javascript_parser/src/es5_parser"),
	actions                = require("./default_actions"),
	compiler               = require("jeefo_javascript_beautifier"),
	Indentation            = require("./indentation"),
	JavascriptPreprocessor = require("./preprocessor"),

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

console.log(preprocessor.compile("IS_UNDEFINED(x)"));
