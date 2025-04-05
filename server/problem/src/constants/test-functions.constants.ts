import { TestCaseType } from '@types'

export const testFunctions = {
    javascript: (testCases: TestCaseType[], solution: string, functionName: string) => {
        return `${solution};
        function evaluate(expected, output) {
  if (Array.isArray(expected) && Array.isArray(output)) {
    return compareArrays(expected, output);
  } else if (typeof expected === "object" && typeof output === "object") {
    return compareObjects(expected, output);
  } else {
    return expected === output;
  }
}

function compareArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  const sortedArr1 = arr1.map(item => JSON.stringify(item)).sort();
  const sortedArr2 = arr2.map(item => JSON.stringify(item)).sort();

  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
}

function compareObjects(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
        (() => {
    let testCases = ${JSON.stringify(testCases)}

    const result = []
    const output = []
    const expected = []

    for(let testCase of testCases) {
        let input = testCase.input.map(param => param.value)
        let userOutput = ${functionName}(...input);
        output.push(userOutput)
        expected.push(testCase.output)
        if(evaluate(userOutput, testCase.output)) {
            result.push(true)
        } else {
            result.push(false)
        }
    }
    console.log(JSON.stringify({result, output, expected}))
})()
        `
    },
    python: (testCases: TestCaseType[], solution: string, functionName: string) => {
        return `${solution}

import json

def evaluate(expected, output):
    if isinstance(expected, list) and isinstance(output, list):
        return compare_lists(expected, output)
    elif isinstance(expected, dict) and isinstance(output, dict):
        return compare_dicts(expected, output)
    else:
        return expected == output

def compare_lists(list1, list2):
    if len(list1) != len(list2):
        return False

    sorted_list1 = sorted(json.dumps(item, sort_keys=True) for item in list1)
    sorted_list2 = sorted(json.dumps(item, sort_keys=True) for item in list2)

    return sorted_list1 == sorted_list2

def compare_dicts(dict1, dict2):
    return json.dumps(dict1, sort_keys=True) == json.dumps(dict2, sort_keys=True)

if __name__ == "__main__":
    test_cases = '''${JSON.stringify(testCases, null, 2)}'''

    test_cases = json.loads(test_cases)
    
    result = []
    output = []
    expected = []

    for test_case in test_cases:
        input_values = [param["value"] for param in test_case["input"]]
        user_output = ${functionName}(*input_values)
        output.append(user_output)
        expected.append(test_case["output"])

        result.append(evaluate(user_output, test_case["output"]))

    print(json.dumps({"result": result, "output": output, "expected": expected}))`
    },

    java: (testCases: TestCaseType[], solution: string, functionName: string) => {
        return `${solution}
    
    import java.lang.reflect.Method;
    import java.util.*;
    
    public class TestRunner {
        public static void main(String[] args) {
            Object[][] testCases = ${JSON.stringify(testCases)};
    
            List<Boolean> result = new ArrayList<>();
            List<Object> output = new ArrayList<>();
            List<Object> expected = new ArrayList<>();
    
            try {
                Solution solutionInstance = new Solution();
                
                Method method = Solution.class.getMethod("${functionName}", Object[].class);
    
                for (Object[] testCase : testCases) {
                    Object[] input = (Object[]) testCase[0];
                    Object expectedOutput = testCase[1];
    
                    // Invoke the method dynamically
                    Object userOutput = method.invoke(solutionInstance, (Object) input);
    
                    output.add(userOutput);
                    expected.add(expectedOutput);
                    result.add(evaluate(userOutput, expectedOutput));
                }
    
                System.out.println("{\\"result\\": " + result +
                                   ", \\"output\\": " + output +
                                   ", \\"expected\\": " + expected + "}");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    
        public static boolean evaluate(Object userOutput, Object expectedOutput) {
            return Objects.equals(userOutput, expectedOutput);
        }
    }`
    },

    golang: (testCases: TestCaseType[], solution: string, functionName: string) => {
        return `${solution}

package main

import (
	"encoding/json"
	"fmt"
	"reflect"
)

func evaluate(userOutput, expectedOutput interface{}) bool {
	return reflect.DeepEqual(userOutput, expectedOutput)
}

func main() {
	testCases := ${JSON.stringify(testCases)}

	var result []bool
	var output []interface{}
	var expected []interface{}

	for _, testCase := range testCases {
		var inputValues []interface{}
		for _, param := range testCase["input"].([]map[string]interface{}) {
			inputValues = append(inputValues, param["value"])
		}

		userOutput := ${functionName}(inputValues...)
		output = append(output, userOutput)
		expected = append(expected, testCase["output"])

		result = append(result, evaluate(userOutput, testCase["output"]))
	}

	resultJSON, _ := json.Marshal(map[string]interface{}{
		"result":   result,
		"output":   output,
		"expected": expected,
	})

	fmt.Println(string(resultJSON))
}`
    },
}
