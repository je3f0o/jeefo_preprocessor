/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression.js
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
	name    : "SequenceExpression",
	handler : function (_pp, token) {
		var pp          = _pp.$new(token),
			expressions = pp.parse(pp.code)[0].expression.expressions,
			i = expressions.length, has_action;

		while (i--) {
			if (has_action) {
				pp.action(pp.actions.invoke(pp, expressions[i]));
			} else {
				has_action = pp.action(pp.actions.invoke(pp, expressions[i]));
			}
		}

		if (has_action) {
			return _pp.replace(token, pp.code);
		}
	}
};
