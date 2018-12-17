/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2017-08-18
* Updated at  : 2018-12-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Actions         = require("../../actions"),
	default_actions = [
		"identifier",
		"if_statement",
		"variable_declaration",
		"function_declaration",

		"array_literal",
		"object_literal",

		"try_statement",
		"for_statement",
		"break_statement",
		"while_statement",
		"throw_statement",
		"block_statement",
		"return_statement",
		"switch_statement",
		"do_while_statement",
		"continue_statement",
		"labelled_statement",
		"expression_statement",

		"new_expression",
		"call_expression",
		"unary_expression",
		"member_expression",
		"binary_expression",
		"sequence_expression",
		"function_expression",
		"grouping_expression",
		"equality_expression",
		"assignment_expression",
		"comparision_expression",
		"conditional_expression",
	],
	no_operation_actions = [
		"Comment",
		"NullLiteral",
		"NumberLiteral",
		"StringLiteral",
		"RegExpLiteral",
		"BooleanLiteral",
		"EmptyStatement",
	],
	binary_expressions = [
		"InExpression",
		"LogicalAndExpression",
		"LogicalOrExpression",
		"LogicalXorExpression"
	],
	i       = default_actions.length,
	noop    = function () {},
	actions = new Actions(),
	binary_handler = require("./binary_handler"),
	action;

while (i--) {
	action = require(`./${ default_actions[i] }`);
	actions.register(action.name, action.handler);
}

i = no_operation_actions.length;
while (i--) {
	actions.register(no_operation_actions[i], noop);
}

i = binary_expressions.length;
while (i--) {
	actions.register(binary_expressions[i], binary_handler);
}

module.exports = actions;
