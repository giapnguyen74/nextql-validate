const Validator = require("fastest-validator");
let v;

function doValidate(check, origMethod) {
	return function() {
		const params = arguments[0];
		const errors = check(params);
		if (errors == true) {
			return origMethod.apply(this, arguments);
		} else {
			const error = new Error("Validation error!");
			error.code = 400;
			error.errors = errors;
			return Promise.reject(error);
		}
	};
}

function beforeCreateHook(options) {
	options.$validates = {};
	Object.keys(options.validates).forEach(k => {
		options.$validates[k] = v.compile(options.validates[k]);
		if (options.methods && options.methods[k]) {
			options.methods[k] = doValidate(
				options.$validates[k],
				options.methods[k]
			);
		}
	});
}

module.exports = {
	install(nextql, options) {
		v = new Validator(options || {});
		nextql.beforeCreate(beforeCreateHook);
	}
};
