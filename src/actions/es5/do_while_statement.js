/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : do_while_statement.js
* Created at  : 2018-12-18
* Updated at  : 2018-12-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = {
	name    : "DoWhileStatement",
	handler : function (_pp, token) {
		var pp      = _pp.$new(token),
			stmt    = pp.parse(pp.code)[0],
			actions = [], i, has_action;

		actions[0] = pp.actions.invoke(pp, stmt.statement);
		actions[1] = pp.actions.invoke(pp, stmt.test);

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
