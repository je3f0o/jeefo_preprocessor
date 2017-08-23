/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration.js
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
	name    : "VariableDeclaration",
	handler : function (_pp, token) {
		var pp           = _pp.$new(token),
			declarations = pp.parse(pp.code)[0].declarations,
			i = 0, actions = [], has_action;

		for (; i < declarations.length; ++i) {
			if (declarations[i].init) {
				actions[i] = pp.actions.invoke(pp, declarations[i].init);
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
			return pp.replace(token, pp.code);
		}
	}
};
