/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement.js
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
	name    : "IfStatement",
	handler : function (_pp, token) {
		var pp   = _pp.$new(token),
			stmt = pp.parse(pp.code)[0],
			actions = [], i = 2, has_action;

		actions[0] = pp.actions.invoke(pp, stmt.test);
		actions[1] = pp.actions.invoke(pp, stmt.statement);

		if (stmt.alternate) {
			i = 3;
			actions[2] = pp.actions.invoke(pp, stmt.alternate);
		}

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
