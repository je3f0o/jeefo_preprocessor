/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_expression.js
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

var argument_handler = function (_pp, token) {
	if (token.argument) {
		var pp         = _pp.$new(token.argument),
			action     = pp.actions.invoke(pp, pp.parse(pp.code)[0].expression),
			has_action = pp.action(action);

		if (has_action) {
			return _pp.replace(token.argument, pp.code);
		}
	}
};

var negation_expression = function (_pp, code) {
	var pp    = _pp.$new(),
		stmt  = pp.parse(code)[0],
		token = stmt.expression;

	switch (token.type) {
		case "EqualityExpression" :
			switch (token.operator) {
				case  "==" :
				case "===" :
					token.operator = "!==";
					break;
				case  "!=" :
				case "!==" :
					token.operator = "===";
					break;
			}

			return `${ pp.compiler.compile(token.left) } ${ token.operator } ${ pp.compiler.compile(token.right) }`;
	}
};

module.exports = {
	name    : "UnaryExpression",
	handler : function (_pp, token) {
		var action = argument_handler(_pp, token);
		if (action) {
			if (token.operator === '!') {
				return _pp.replace(token, negation_expression(_pp, action.value));
			}

			return action;
		}
	}
};
