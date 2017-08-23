/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ignore_comment_spec.js
* Created at  : 2017-04-29
* Updated at  : 2017-04-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

/* global */
/* exported */
/* exported */

//ignore:end

var pp     = require("../index"),
	expect = require("expect");

// Runtime define {{{1
describe("Ignore comment", () => {

var code = `// ignore:start 

/*
 * Something random stuffs...
 */

// ignore:end
var x = 1;`;

	var result = "var x = 1;";
	it(`Should be '${ result }'`, () => {
		code = pp.process("[IN MEMORY]", code);
		expect(code).toBe(result);
	});
});
// }}}1
