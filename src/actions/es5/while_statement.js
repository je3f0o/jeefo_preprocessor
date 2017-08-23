/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement.js
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

module.exports = {
	name    : "WhileStatement",
	handler : function (_pp, token) {
		var pp = _pp.$new(token), actions = new Array(2), i = 2, stmt, has_action;

		stmt = pp.parse(pp.code)[0];

		actions[0] = pp.actions.invoke(pp, stmt.test);
		actions[1] = pp.actions.invoke(pp, stmt.statement);

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
