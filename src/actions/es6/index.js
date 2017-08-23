/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
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

var actions = require("../es5").clone(),

	default_actions = [
		"template_literal",
		"tagged_template_literal",

		"arrow_function_expression",
	],
	i = default_actions.length, action;

while (i--) {
	action = require(`./${ default_actions[i] }`);
	actions.register(action.name, action.handler);
}

actions.register("ExportDefaultStatement", function (pp, token) {
	var action = pp.actions.invoke(pp, token.declaration);
	if (action) {
		switch (action.type) {
			case "replace" :
				return pp.replace(token, `module.exports = ${ action.value };`);
			case "remove" :
				return pp.remove(token);
		}
	}
	return pp.replace(token, `module.exports = ${ pp.get_code(pp.code, token.declaration) };`);
});

module.exports = actions;
