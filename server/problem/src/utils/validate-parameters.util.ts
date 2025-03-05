import { DataTypes, TestCaseType } from "../Types/types";

export const validateParameter = (type: DataTypes, value: string): boolean => {
  switch (type) {
    case "Integer":
      return /^-?\d+$/.test(value);
    case "Floating Point":
      return /^-?\d+(\.\d+)?$/.test(value);
    case "String":
      return typeof value === "string";
    case "Boolean":
      return value === "true" || value === "false";
    case "Array":
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    default:
      return false;
  }
};

const getParameterTypeMap = (
  parameters: { name: string; type: DataTypes }[]
) => {
  return parameters.reduce((acc, param) => {
    acc[param.name] = param.type;
    return acc;
  }, {} as Record<string, DataTypes>);
};

export const validateTestCase = (
  testCase: TestCaseType,
  parameters: { name: string; type: DataTypes }[]
) => {
  const paramTypes = getParameterTypeMap(parameters);

  return testCase.input.every(({ parameter, value }) => {
    const expectedType = paramTypes[parameter];
    return expectedType ? validateParameter(expectedType, value) : false;
  });
};

export const isValidFunctionString = (code: string): boolean => {
  try {
    new Function(`return ${code}`)();
    return true;
  } catch (e) {
    return false;
  }
};
