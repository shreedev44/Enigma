import { DataTypes, ProblemParameterType } from "@/types/types";

export const initialState: ProblemParameterType = {
  name: "",
  type: "Integer",
  paramMaxValue: "",
  paramMinValue: "",
  elemType: "Integer",
  elemMaxValue: "",
  elemMinValue: "",
  nestedType: "Integer",
  nestedMaxValue: "",
  nestedMinValue: "",
};

type ActionType = {
  type:
    | "name"
    | "type"
    | "paramMaxValue"
    | "paramMinValue"
    | "elemType"
    | "elemMaxValue"
    | "elemMinValue"
    | "nestedType"
    | "nestedMaxValue"
    | "nestedMinValue"
    | "reset";
  payload: string | DataTypes;
};

export const parameterReducer = (
  state: ProblemParameterType,
  action: ActionType
): ProblemParameterType => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "type":
      return { ...state, type: action.payload as DataTypes };
    case "paramMaxValue":
      return { ...state, paramMaxValue: action.payload };
    case "paramMinValue":
      return { ...state, paramMinValue: action.payload };
    case "elemType":
      return { ...state, elemType: action.payload as DataTypes };
    case "elemMaxValue":
      return { ...state, elemMaxValue: action.payload };
    case "elemMinValue":
      return { ...state, elemMinValue: action.payload };
    case "nestedType":
      return { ...state, nestedType: action.payload as DataTypes };
    case "nestedMaxValue":
      return { ...state, nestedMaxValue: action.payload };
    case "nestedMinValue":
      return { ...state, nestedMinValue: action.payload };
    case 'reset':
        return initialState;
    default:
      return state;
  }
};
