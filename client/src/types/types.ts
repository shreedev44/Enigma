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
	testCases?: TestCaseType[];
	status?: "listed" | "unlisted";
	createdAt?: Date;
	updatedAt?: Date;
	constraints?: string[];
};

export type ProblemListType = {
	_id: string;
	title: string;
	difficulty: DifficultyType;
	problemNo: number;
	successRate?: number;
	solved?: "solved" | "unsolved";
	status?: "listed" | "unlisted"
};

export type Language = "javascript" | "python" | "java" | "golang" | "cpp";

export type AttemptType = {
	_id: string;
	status: "Accepted" | "Rejected" | "Compile Error";
	language: Language;
	runTime: string;
	memory: string;
	rejectionMessage?: string;
	testCasePassed: number;
	solution: string;
	rejectedTestCase?: {
		expected: string;
		output: string;
	};
	createdAt: Date;
};
