/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : actions.js
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

var Actions = function (handlers) {
	this.handlers = assign(create_object(null), handlers);
};

Actions.prototype = {
	clone : function () {
		return new Actions(this.handlers);
	},

	register : function (name, handler) {
		this.handlers[name] = handler;
		return this;
	},

	invoke : function (pp, token) {
		if (! this.handlers[token.type]) {
			console.log(token);
		}
		return this.handlers[token.type](pp, token);
	}
};

module.exports = Actions;
