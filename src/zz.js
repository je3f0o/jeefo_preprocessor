/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : zz.js
* Created at  : 2017-08-19
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

namespace("preprocessor.actions", [
	"preprocessor.Actions",
	"jeefo_template.compiler",
	"jeefo_template.attrs",
], function (Actions, jt_compiler, attrs_compiler) {


	var actions = new Actions();

	// Jeefo Template {{{2
	register("JeefoTemplate", function (_pp, token) {
		var pp = _pp.$new(), expressions = [], j = 0, i, tl_pp, code, body, action, values;

		pp.code = _pp.get_code(_pp.code, token.template);
		body    = pp.parse(pp.code)[0].expression.body;

		for (i = body.length - 1; i >= 0; --i) {
			if (body[i].type === "TemplateLiteralExpression") {
				tl_pp      = pp.$new();
				tl_pp.code = pp.get_code(pp.code, body[i].expression);

				if (body[i].expression.type === "CallExpression" && body[i].expression.callee.name === "PRE_ATTRS_STRINGIFY") {
					code = Function.call(null, `return ${ pp.get_code(pp.code, body[i].expression.arguments[0]) };`)();
					code = attrs_compiler.stringify(code);
					code = code.replace(/\\/g, "\\\\");

					action = pp.replace(body[i], code);
					pp.action(action);
				} else {
					expressions[j++] = tl_pp.compile(tl_pp.code, tl_pp.parse(tl_pp.code));

					action = pp.replace(body[i], `__TEMPLATE_EXPRESSION_${ i }__`);
					pp.action(action);
				}
			}
		}

		code = '';
		pp.code = jt_compiler(pp.code.substring(1, pp.code.length - 1));

		values = pp.code.split(/__TEMPLATE_EXPRESSION_\d+__/);
		for (i = 0; i < values.length; ++i) {
			if (values[i]) {
				code += code ? ` + ${ get_string(values[i]) }` : get_string(values[i]);
			}
			if (expressions[i]) {
				code += ` + ${ expressions[i] }`;
			}
		}

		return _pp.replace(token, code);
	}).

	// Trim lines {{{2
	register("TrimLines", function (_pp, token) {
		var i      = 0,
			pp     = _pp.$new(token.template),
			result = [], body, tl_pp;

		body = pp.parse(pp.code)[0].expression.body;

		for (i = 0; i < body.length; ++i) {
			if (body[i].type === "TemplateLiteralExpression") {
				tl_pp = pp.$new(body[i].expression);

				result.push(
					tl_pp.compile(tl_pp.code, tl_pp.parse(tl_pp.code))
				);
			} else {
				result.push(
					get_string(body[i].value.split('\n').map(line => line.trim()).join(''))
				);
			}
		}

		return _pp.replace(token, result.join(" + "));
	});
	// }}}2
})

// }}}1
