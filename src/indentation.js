/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : indentation.js
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

var Indentation = function (space, indentation) {
	this.space       = space;
	this.indentation = indentation;
};

Indentation.prototype = {
	clone : function () {
		return new Indentation(this.space, this.indentation);
	},

	indent : function () {
		return new Indentation(`${ this.space }${ this.indentation }`, this.indentation);
	},

	outdent : function () {
		return new Indentation(
			this.space.substring(0, this.space.length - this.indentation.length),
			this.indentation
		);
	},
};

module.exports = Indentation;
