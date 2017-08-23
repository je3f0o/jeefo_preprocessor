/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
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
	name    : "MemberExpression",
	handler : function (_pp, token) {
		var pp      = _pp.$new(token),
			member  = pp.parse(pp.code)[0].expression,
			actions = [], has_action;

		actions[0] = pp.actions.invoke(pp, member.object);
		actions[1] = pp.actions.invoke(pp, member.property);

		has_action = pp.action(actions[1]);
		if (has_action) {
			pp.action(actions[0]);
		} else {
			has_action = pp.action(actions[0]);
		}

		if (has_action) {
			return _pp.replace(token, pp.code);
		}
	}
};
