/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier.js
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

module.exports = {
	name    : "Identifier",
	handler : function (pp, token) {
		var replacement = pp.scope.defines[token.name];
		if (replacement) {
			return pp.replace(token, replacement);
		}
	}
};
