/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : scope.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var assign        = require("jeefo_utils/object/assign"),
	create_object = Object.create;

var Scope = function (parent, indent) {
	this.indent  = indent;
	this.defines = assign(create_object(null), parent ? parent.defines : null);
};

Scope.prototype = {
	$new : function () {
		return new Scope(this, this.indent.indent());
	},

	clone : function () {
		return new Scope(this, this.indent.clone());
	},

	define : function (name, definition) {
		this.defines[name] = definition;
	}
};

module.exports = Scope;
