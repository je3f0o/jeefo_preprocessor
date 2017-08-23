/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_string.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var SINGLE_QUOTE_REGEX         = /'/,
	DOUBLE_QUOTE_REGEX         = /"/,
	DOUBLE_QUOTE_REPLACE_REGEX = /"/g,
	SINGLE_QUOTE_REPLACE_REGEX = /'/g;

module.exports = function (value) {
	if (value === '') { return "''"; }

	if (value.length === 1) {
		if (value === '"') {
			return `'"'`;
		} else if (value === "'") {
			return `"'"`;
		}
		return `'${ value }'`;
	}

	if (value.length === 2 && value.charAt(0) === '\\') {
		if (SINGLE_QUOTE_REGEX.test(value)) {
			return `"${ value }"`;
		}
		return `'${ value }'`;
	}

	if (DOUBLE_QUOTE_REGEX.test(value)) {
		if (SINGLE_QUOTE_REGEX.test(value)) {
			var i = 0, single_count = 0, double_count = 0;
			for (i = 0; i < value.length; ++i) {
				switch (value.charAt(i)) {
					case "'":
						single_count += 1;
						break;
					case '"':
						double_count += 1;
						break;
					case '\\':
						i += 1;
				}
			}
			if (double_count > single_count) {
				return `'${ value.replace(SINGLE_QUOTE_REPLACE_REGEX, "\\'") }'`;
			}
			return `"${ value.replace(DOUBLE_QUOTE_REPLACE_REGEX, '\\"') }"`;
		}
		return `'${ value }'`;
	}

	return `"${ value }"`;
};
