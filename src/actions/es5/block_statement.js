/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement.js
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
	name    : "BlockStatement",
	handler : function (_pp, token) {
		if (! token.body.length) { return; }

		var pp         = _pp.$new(token),
			actions    = [],
			statements = pp.parse(pp.code)[0].body,
			i = 0, has_action;

		pp.scope = pp.scope.$new();

		for (; i < statements.length; ++i) {
			actions[i] = pp.actions.invoke(pp, statements[i]);
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
