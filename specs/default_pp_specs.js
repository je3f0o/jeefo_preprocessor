/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : default_pp_specs.js
* Created at  : 2017-04-29
* Updated at  : 2017-08-20
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

var pp     = require("../index").es5,
	expect = require("expect");

// is_defined {{{1
describe("IS_DEFINED", () => {
	var result = `if (value !== void 0) {}`;
	it(`Should be '${ result }'`, () => {
		var code = pp.process("[IN MEMORY]", "if (IS_DEFINED(value)) {}");
		expect(code).toBe(result);
	});
});

// is_undefined {{{1
describe("IS_UNDEFINED", () => {
	var result = `if (value === void 0) {}`;
	it(`Should be '${ result }'`, () => {
		var code = pp.process("[IN MEMORY]", "if (IS_UNDEFINED(value)) {}");
		expect(code).toBe(result);
	});
});

// is_null {{{1
describe("IS_NULL", () => {
	var result = `if (value === null) {}`;
	it(`Should be '${ result }'`, () => {
		var code = pp.process("[IN MEMORY]", "if (IS_NULL(value)) {}");
		expect(code).toBe(result);
	});
});

// is_number {{{1
describe("IS_NUMBER", () => {
	var result = `if (typeof value === "number") {}`;
	it(`Should be '${ result }'`, () => {
		var code = pp.process("[IN MEMORY]", "if (IS_NUMBER(value)) {}");
		expect(code).toBe(result);
	});
});

// is_string {{{1
describe("IS_STRING", () => {
	var result = `if (typeof value === "string") {}`;
	it(`Should be '${ result }'`, () => {
		var code = pp.process("[IN MEMORY]", "if (IS_STRING(value)) {}");
		expect(code).toBe(result);
	});
});

// is_boolean {{{1
describe("IS_BOOLEAN", () => {
	var result = `if (typeof value === "boolean") {}`;
	it(`Should be '${ result }'`, () => {
		var code = pp.process("[IN MEMORY]", "if (IS_BOOLEAN(value)) {}");
		expect(code).toBe(result);
	});
});

// is_function {{{1
describe("IS_FUNCTION", () => {
	var result = `if (typeof value === "function") {}`;
	it(`Should be '${ result }'`, () => {
		var code = pp.process("[IN MEMORY]", "if (IS_FUNCTION(value)) {}");
		expect(code).toBe(result);
	});
});
// }}}1
