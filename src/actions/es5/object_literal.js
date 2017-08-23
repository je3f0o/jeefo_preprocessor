/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
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
	name    : "ObjectLiteral",
	handler : function (_pp, token) {
		var pp = _pp.$new(), actions = [], i, has_action, properties;

		pp.code    = `z=${ _pp.get_code(_pp.code, token) }`;
		properties = pp.parse(pp.code)[0].expression.right.properties;

		i = properties.length;
		while (i--) {
			if (properties[i].type === "Property") {
				actions[i] = pp.actions.invoke(pp, properties[i].value);
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
			return _pp.replace(token, pp.code.substring(2));
		}
	}
};
