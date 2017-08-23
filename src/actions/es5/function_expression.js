/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_expression.js
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
	name    : "FunctionExpression",
	handler : function (_pp, token) {
		var pp = _pp.$new(token),
			fn = pp.parse(pp.code)[0], has_action;

		has_action = pp.action(pp.actions.invoke(pp, fn.body));

		if (has_action) {
			return _pp.replace(token, pp.code);
		}
	}
};
