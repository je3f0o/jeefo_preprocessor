/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : template_literal.js
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

var get_string = require("../es5/get_string");

module.exports = {
	name    : "TemplateLiteral",
	handler : function (_pp, token) {
		var pp   = _pp.$new(token),
			body = pp.parse(pp.code)[0].expression.body,
			i = body.length, values = [], tl_pp;

		while (i--) {
			switch (body[i].type) {
				case "TemplateLiteralString" :
					values[i] = get_string(body[i].value);
					break;
				case "TemplateLiteralExpression" :
					tl_pp     = pp.$new(body[i].expression);
					values[i] = tl_pp.process_tokens(tl_pp.code, tl_pp.parse(tl_pp.code));
					break;
			}
		}

		return _pp.replace(token, values.join(" + "));
	}
};
