/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : argument_handler.js
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

module.exports = function (_pp, token) {
	if (token.argument) {
		var pp       = _pp.$new(token),
			argument = pp.parse(pp.code)[0].argument,
			has_action;

		has_action = pp.action(pp.actions.invoke(pp, argument));
		if (has_action) {
			return _pp.replace(token, pp.code);
		}
	}
};
