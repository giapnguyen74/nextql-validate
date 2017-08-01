const NextQL = require("nextql");
const nextql = new NextQL();
nextql.use(require("../src"));

nextql.model("test", {
	methods: {
		function1(params) {
			return params;
		},

		function2(params) {
			return params;
		},
		function3(params) {
			const errors = this.$options.$validates.function1(params);
			if (errors != true) {
				throw new Error("Validate error", errors);
			}
			return params;
		}
	},
	validates: {
		function1: {
			id: { type: "number", positive: true, integer: true },
			name: { type: "string", min: 3, max: 255 },
			status: "boolean"
		}
	}
});

it("validate wrap function", async () => {
	await nextql
		.execute({
			test: {
				function1: {
					$params: { id: 5, name: "Al", status: true }
				}
			}
		})
		.catch(error => {
			expect(error.errors[0]).toMatchObject({
				type: "stringMin",
				expected: 3,
				actual: 2,
				field: "name",
				message:
					"The 'name' field length must be larger than or equal to 3 characters long!"
			});
		});

	await nextql
		.execute({
			test: {
				function1: {
					$params: { id: 5, name: "John", status: true },
					id: 1,
					name: 1,
					status: 1
				}
			}
		})
		.then(result => {
			expect(result).toMatchObject({
				test: {
					function1: {
						id: 5,
						name: "John",
						status: true
					}
				}
			});
		});
});

it("no validate no wrap function", async () => {
	await nextql
		.execute({
			test: {
				function2: {
					$params: { id: 5, name: "Al", status: true },
					id: 1,
					name: 1,
					status: 1
				}
			}
		})
		.then(result => {
			expect(result).toMatchObject({
				test: {
					function2: {
						id: 5,
						name: "Al",
						status: true
					}
				}
			});
		});
});
