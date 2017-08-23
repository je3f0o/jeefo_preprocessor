/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-19
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

module.exports = {
	name    : "ExpressionStatement",
	handler : function (pp, token) {
		var action = pp.actions.invoke(pp, token.expression);
		if (action && action.type === "remove") {
			action.end = token.end.index;
		}
		return action;
	}
};
