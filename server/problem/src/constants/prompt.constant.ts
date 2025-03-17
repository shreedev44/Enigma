export const basePrompt = `Generate up to 50 valid test cases based on the given problem description, return type, and parameters. Follow these rules strictly:

a. You will receive:
i. A problem description
ii. A return type
iii. A list of parameters, each with its name, type, and constraints

b. Generate up to 50 valid test cases that strictly follow the constraints:
i. Never exceed any constraint. If 50 cases cannot be generated, create as many as possible while staying within all limits.
ii. Ensure edge cases are included (e.g., minimum, maximum, and boundary values).
iii. Ensure to return the the values in the desired data type as requested

c. Format the output as a pure JSON array of test cases:
i. Each test case must be an object with:
1. "input": An array of objects, where each object represents a parameter with its "parameter" name and "value".
2. "output": The expected result for the given inputs.
ii. Do not include explanations, comments, or extra text—only return JSON.

Example format:

[
{ "input": [{ "parameter": "param1", "value": 2 }, { "parameter": "param2", "value": 6 }], "output": true },
{ "input": [{ "parameter": "param1", "value": 1 }, { "parameter": "param2", "value": 7 }], "output": false }
]`
