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
	_id?: string;
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
	status?: "listed" | "unlisted";
	createdAt?: Date;
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

export type Job = {
	userId: string;
	companyName: string;
	profilePicture: string;
	role: string;
	workTime: "Full-Time" | "Part-Time";
	workMode: "On-Site" | "Remote" | "Hybrid";
	jobLocation: string;
	minimumExperience: number;
	minSalary?: number;
	maxSalary?: number;
	requirements: string[];
	responsibilities: string[];
	listed?: true;
	lastDate: Date;
	createdAt: Date;
};

export type ApplicationWithJob = {
	_id: string;
	companyName: string;
	role: string;
	createdAt: Date;
	status:
		| "received"
		| "shortlisted"
		| "interview requested"
		| "accepted"
		| "rejected";
};

export type ApplicationShort = {
	_id: string;
	name: string;
	email: string;
	phone: string;
	yearOfExperience: number;
};

export interface Education {
	university: string;
	degree: string;
	graduationYear: number;
	cgpa: number;
}

export interface Experience {
	company: string;
	title: string;
	location: string;
	dates: string;
}

export type Application = {
	_id: string;
	userId?: string;
	name: string;
	email: string;
	phone: string;
	yearOfExperience: 0;
	summary: string;
	skills: string[];
	education: Education[];
	experience: Experience[];
};

export interface LeaderboardEntry {
	userId: string;
	rank: number;
	username: string;
	profilePicture: string;
	solved: {
		beginner: number;
		intermediate: number;
		advanced: number;
	};
}

export interface CurrentSubscription {
	planId: string;
	startedAt: Date;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Filters {
	expectedSalary: number;
	workMode: string;
	workTime: string;
	minimumExperience: number;
}
