/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_literal.js
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
	name    : "ArrayLiteral",
	handler : function (_pp, token) {
		var pp       = _pp.$new(token),
			elements = pp.parse(pp.code)[0].expression.elements,
			i = elements.length,
			actions = [], has_action;

		
		while (i--) {
			actions[i] = pp.actions.invoke(pp, elements[i]);
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
