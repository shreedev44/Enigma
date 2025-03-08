import mongoose from "mongoose";

export type DataTypes =
  | "Array"
  | "Floating Point"
  | "String"
  | "Integer"
  | "Boolean";

export type DifficultyType = "Beginner" | "Intermediate" | "Advanced";

export type TestCaseType = {
  input: { parameter: string; value: string }[];
  output: string;
};

export type ProblemParameter = {
  name: string;
  type: DataTypes;
  paramMinValue: number;
  paramMaxValue: number;
  elemType?: DataTypes;
  elemMinValue?: number;
  elemMaxValue?: number;
  nestedType?: Exclude<DataTypes, "Array">;
  nestedMinValue?: number;
  nestedMaxValue?: number;
};

export type ProblemType = {
  problemNo?: number;
  title: string;
  difficulty: DifficultyType;
  description: string;
  functionName: string;
  parameters: ProblemParameter[];
  functionReturnType: DataTypes;
  functionReturnElemType?: DataTypes;
  functionReturnNestedType?: Exclude<DataTypes, "Array">;
  evalFunction: string;
  testCases: TestCaseType[];
  status?: "listed" | "unlisted";
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProblemListType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  difficulty: DifficultyType;
  problemNo?: number;
  successRate?: number;
  solved?: boolean;
  status?: "listed" | "unlisted";
};

export type Language = "javascript" | "python" | "java" | "cpp"
