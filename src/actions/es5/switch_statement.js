/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : switch_statement.js
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
	name    : "SwitchStatement",
	handler : function (_pp, token) {
		var pp      = _pp.$new(token),
			cases   = pp.parse(pp.code)[0].cases,
			actions = [], i = 0, j = 0, s, has_action, statements;

		for (; i < cases.length; ++i) {
			if (cases[i].test) {
				actions[j++] = pp.actions.invoke(pp, cases[i].test);
			}
			for (statements = cases[i].statements, s = 0; s < statements.length; ++s) {
				actions[j++] = pp.actions.invoke(pp, statements[s]);
			}
		}

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
