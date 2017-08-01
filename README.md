# nextql-validate
Validate plugin for nextql methods, using fastest-validator [fastest-validator](https://github.com/icebob/fastest-validator). Please refer the project for detail schema and api.

## Using

```js
const NextQL = require("nextql");
const nextql = new NextQL();
nextql.use(require("nextql-validate"));

nextql.model("test", {
	methods: {
		function1(params) {
			return params;
		},
		function2(params) {
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
```
The plugin accept **validates** option as fastest-validator schema to compile into **$validates** check functions.

### Auto validate
In above example, both methods and validates option have **function1** key. The plugin will patch function1 method to apply validate checking before original method called.

So when nextql call function1; it will automatically verify validates function1.

### Manual validate
In above example, method **function2** don't have validates setting. So it don't check params automatically. But it can get validates from **this.$options.$validates** to perform manual check.


##License
nextql-validate is available under the MIT license.



