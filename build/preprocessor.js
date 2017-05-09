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

var jeefo = require("jeefo").create();

jeefo.use(require("jeefo_core"));
jeefo.use(require("jeefo_tokenizer"));
jeefo.use(require("jeefo_javascript_parser"));
jeefo.use(require("jeefo_javascript_beautifier"));
jeefo.use(require("./pp"));

/* globals */
/* exported */

//ignore:end

var app = jeefo.module("jeefo_preprocessor");

app.run(["javascript.ES5_preprocessor"], function (pp) {
	module.exports = function (filename, code) {
		return pp.process(filename, code);
	};
});
