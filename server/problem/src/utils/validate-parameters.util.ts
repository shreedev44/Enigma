import { DataTypes, TestCaseType } from "../Types/types";

export const validateParameter = (type: DataTypes, value: unknown): boolean => {
  const newValue = String(value)
  switch (type) {
    case "Integer":
      return /^-?\d+$/.test(newValue);
    case "Floating Point":
      return /^-?\d+(\.\d+)?$/.test(newValue);
    case "String":
      return typeof newValue === "string";
    case "Boolean":
      return newValue === "true" || newValue === "false";
    case "Array":
      try {
        const parsed = JSON.parse(newValue);
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
