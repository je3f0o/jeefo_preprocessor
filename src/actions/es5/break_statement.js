/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : break_statement.js
* Created at  : 2017-08-20
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
	name    : "BreakStatement",
	handler : function (pp, token) {
		if (token.label) {
			return pp.actions.invoke(pp, token.label);
		}
	}
};
