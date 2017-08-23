/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_expression.js
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
	name    : "ConditionalExpression",
	handler : function (_pp, token) {
		var pp      = _pp.$new(token),
			ternary = pp.parse(pp.code)[0].expression,
			actions = [], i = 3, has_action;

		actions[0] = pp.actions.invoke(pp, ternary.test);
		actions[1] = pp.actions.invoke(pp, ternary.consequent);
		actions[2] = pp.actions.invoke(pp, ternary.alternate);

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
