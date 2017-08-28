/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : call_expression.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-26
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var call_expression = function (_pp, token) {
	var pp         = _pp.$new(token),
		expression = pp.parse(pp.code)[0].expression,

		args = expression.arguments, i = 0,

		actions = [], has_action;

	actions[0] = pp.actions.invoke(pp, expression.callee);
	for (; i < args.length; ++i) {
		actions[i + 1] = pp.actions.invoke(pp, args[i]);
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
};

module.exports = {
	name    : "CallExpression",
	handler : function (pp, token) {
		switch (token.callee.type) {
			case "CallExpression" :
				return call_expression(pp, token);
			case "MemberExpression" :
				if (token.callee.object.name === "PP" && token.callee.property.name === "define") {
					pp.define(
						token.arguments[0].value,
						token.arguments[1],
						token.arguments[2]
					);
				} else {
					return call_expression(pp, token);
				}
				break;
			case "Identifier":
				var def = pp.scope.defines[token.callee.name];
				if (def) {
					var i = def.params.length - 1;

					var _pp = def.clone();

					for (; i >= 0; --i) {
						_pp.define(def.params[i], token.arguments[i]);
					}

					return pp.replace(token, _pp.process_tokens(def.code, def.tokens));
				} else {
					return call_expression(pp, token);
				}
		}
	}
};
