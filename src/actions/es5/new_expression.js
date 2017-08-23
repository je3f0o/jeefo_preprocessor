/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_expression.js
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
	name    : "NewExpression",
	handler : function (_pp, token) {
		var pp      = _pp.$new(token),
			expr    = pp.parse(pp.code)[0].expression,
			args    = expr.arguments,
			actions = [], i, has_action;

		i = args.length;
		while (i--) {
			actions[i] = pp.actions.invoke(pp, args[i]);
		}
		actions.unshift(pp.actions.invoke(pp, expr.callee));

		i = actions.length;
		while (i--) {
			if (has_action) {
				pp.action(actions[i]);
			} else {
				has_action = pp.action(actions[i]);
			}
		}

		if (has_action) {
			return _pp.replace(token, pp.code);
		}
	}
};
