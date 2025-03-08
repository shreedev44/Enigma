export type DataTypes =
  | "Array"
  | "Floating Point"
  | "String"
  | "Integer"
  | "Boolean";

export type ProblemParameterType = {
  name: string;
  type: DataTypes;
  paramMinValue: string;
  paramMaxValue: string;
  elemType?: DataTypes;
  elemMinValue?: string;
  elemMaxValue?: string;
  nestedType?: DataTypes;
  nestedMinValue?: string;
  nestedMaxValue?: string;
};

export type TestCaseType = {
  input: { parameter: string; value: string }[];
  output: string;
};

export type DifficultyType = "Beginner" | "Intermediate" | "Advanced";

export type ProblemType = {
  problemNo?: number;
  title: string;
  difficulty: DifficultyType;
  description: string;
  functionName: string;
  parameters: ProblemParameterType[];
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
  _id: string;
  title: string;
  difficulty: DifficultyType;
  problemNo: number;
  successRate?: number;
  solved?: boolean;
  status?: "listed" | "unlisted";
}

export type Language = "javascript" | "python" | "java" | "cpp"