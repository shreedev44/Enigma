import { ProblemParameterType } from "@/types/types";
import { camelCaseRegex } from "./regex";

export const validateForm = (
  validationSchema: Record<
    string,
    {
      rules: (RegExp | ((value: unknown, form: Record<string, unknown>) => boolean))[];
      messages: string[];
      optional?: boolean;
    }
  >,
  form: Record<string, unknown>
): { field: string; message: string } | null => {
  for (const field in validationSchema) {
    const value = form[field];
    const { rules, messages, optional } = validationSchema[field];

    if (optional && (value === undefined || value === null)) {
      continue;
    }

    for (const rule of rules) {
      const isValid =
        typeof rule === "function"
          ? rule(value, form)
          : rule instanceof RegExp
          ? rule.test(value as string)
          : true;

      if (!isValid) {
        return { field, message: messages[rules.indexOf(rule)] };
      }
    }
  }
  return null;
};

export const validateParameter = (
  parameterField: ProblemParameterType,
  parameters: ProblemParameterType[]
): { field: string; message: string } | null => {
  if (!camelCaseRegex.test(parameterField.name.trim())) {
    return {
      field: "parameterName",
      message: "Name should be in camel case(myParam)",
    };
  }
  if (!parameterField.paramMinValue) {
    return {
      field: "paramMinValue",
      message: "Min value is required",
    };
  }
  if (!parameterField.paramMaxValue) {
    return {
      field: "paramMaxValue",
      message: "Max value is required",
    };
  }
  if (parameters.length >= 5) {
    return { field: "parameter", message: "Maximum 5 parameters allowed" };
  }
  const alreadyExist = parameters.find(
    (parameter) => parameter.name === parameterField.name.trim()
  );
  if (alreadyExist) {
    return { field: "parameterName", message: "Parameter already exist" };
  }
  if (isNaN(Number(parameterField.paramMinValue))) {
    return {
      field: "paramMinValue",
      message: "Please enter a valid min value",
    };
  }
  if (
    Number(parameterField.paramMaxValue) <= Number(parameterField.paramMinValue)
  ) {
    return {
      field: "paramMaxValue",
      message: "Please enter a valid max value",
    };
  }
  if (parameterField.type === "Array") {
    if (!parameterField.elemMinValue) {
      return {
        field: "elemMinValue",
        message: "Min value is required",
      };
    }
    if (!parameterField.elemMaxValue) {
      return {
        field: "elemMaxValue",
        message: "Max value is required",
      };
    }
    if (parameterField.elemType === 'Array' && Number(parameterField.elemMinValue) < 0) {
      return {
        field: "elemMinValue",
        message: "Please enter a valid min value",
      };
    }
    if (
      Number(parameterField.elemMaxValue) <= Number(parameterField.elemMinValue)
    ) {
      return {
        field: "elemMaxValue",
        message: "Please enter a valid max value",
      };
    }
    if (parameterField.elemType === "Array") {
      if (!parameterField.nestedMinValue) {
        return {
          field: "nestedMinValue",
          message: "Min value is required",
        };
      }
      if (!parameterField.nestedMaxValue) {
        return {
          field: "nestedMaxValue",
          message: "Max value is required",
        };
      }
      if (isNaN(Number(parameterField.nestedMinValue))) {
        return {
          field: "nestedMinValue",
          message: "Please enter a valid min value",
        };
      }
      if (
        Number(parameterField.nestedMaxValue) <=
        Number(parameterField.nestedMinValue)
      ) {
        return {
          field: "nestedMaxValue",
          message: "Please enter a valid max value",
        };
      }
    }
  }
  return null;
};
