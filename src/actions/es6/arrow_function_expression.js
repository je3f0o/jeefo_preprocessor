/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function_expression.js
* Created at  : 2017-08-20
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
	name    : "ArrowFunctionExpression",
	handler : function (_pp, token) {
		var pp     = _pp.$new(token),
			expr   = pp.parse(pp.code)[0].expression,
			params = expr.parameters,
			i = params.length, actions = [];

		while (i--) {
			actions[i] = pp.actions.invoke(pp, params[i]);
		}

		actions.push(pp.actions.invoke(pp, expr.body));

		i = actions.length;
		while (i--) {
			pp.action(actions[i]);
		}

		params = pp.code.substring(0, pp.code.indexOf(')') + 1);
		return pp.replace(token, `function ${ params } ${ pp.get_code(pp.code, expr.body) }`);
	}
};
