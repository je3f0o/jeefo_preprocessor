/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : runtime_define_specs.js
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

var pp     = require("../index").es5,
	expect = require("expect");

describe("Runtime define", () => {

	describe("With in scope", () => {

		var code = `
		if (true) {
			PP.define("ASSIGN_TEN", function (x) { return x = 10; }, true);
		}

		ASSIGN_TEN(dynamic_var);`;

		var result = `
		if (true) {
			PP.define("ASSIGN_TEN", function (x) { return x = 10; }, true);
		}

		ASSIGN_TEN(dynamic_var);`;

		it(`Should not be modified`, () => {
			code = pp.process("[IN MEMORY]", code);
			expect(code).toBe(result);
		});
	});

	describe("Without scope", () => {
		var code = `
		PP.define("ASSIGN_TEN", function (x) { return x = 10; }, true);

		ASSIGN_TEN(dynamic_var);`;

		var result = `
		PP.define("ASSIGN_TEN", function (x) { return x = 10; }, true);

		dynamic_var = 10;`;

		it(`Should be modified`, () => {
			code = pp.process("[IN MEMORY]", code);
			expect(code).toBe(result);
		});
	});
});
