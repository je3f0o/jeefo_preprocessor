/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2017-08-18
* Updated at  : 2017-09-07
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

module.exports = {
	name    : "GroupingExpression",
	handler : function (pp, token) {
		return pp.actions.invoke(pp, token.expression);
	}
};
