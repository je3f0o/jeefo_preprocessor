/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
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

var props = ["init", "test", "update"];

module.exports = {
	name    : "ForStatement",
	handler : function (_pp, token) {
		var pp      = _pp.$new(token),
			stmt    = pp.parse(pp.code)[0],
			actions = [], i = 3, has_action;

		while (i--) {
			if (stmt[props[i]]) {
				actions[i] = pp.actions.invoke(pp, stmt[props[i]]);
			}
		}
		actions[3] = pp.actions.invoke(pp, stmt.statement);

		i = 4;
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
