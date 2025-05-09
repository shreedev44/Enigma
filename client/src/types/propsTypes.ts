import { RecruiterData, StudentData } from "./formTypes";
import { ApplicationWithJob, ProblemListType } from "./types";

export interface BreadcrumbPropType {
	components: { component: string; path?: string | number }[];
}

export interface StdntEditProfilePropType {
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	profilePicture: string;
	setProfilePicture: (value: string) => void;
	githubProfile: string;
	setGithubProfile: (value: string) => void;
	linkedinProfile: string;
	setLinkedinProfile: (value: string) => void;
	isModalOpen: boolean;
	changePassword: () => void;
}

export interface RctrEditProfilePropType {
	companyName: string;
	setCompanyName: (value: string) => void;
	bio: string;
	setBio: (value: string) => void;
	basedAt: string;
	setBasedAt: (value: string) => void;
	linkedinProfile: string;
	setLinkedinProfile: (value: string) => void;
	facebookProfile: string;
	setFacebookProfile: (value: string) => void;
	twitterProfile: string;
	setTwitterProfile: (value: string) => void;
	profilePicture: string;
	setProfilePicture: (value: string) => void;
	isModalOpen: boolean;
	changePassword: () => void;
}

export interface AdminPagePropType {
	setBreadcrumbs: (value: { component: string; path?: string }[]) => void;
}

export type UsersPagePropType = {
	data: StudentData[] | RecruiterData[];
	user: "student" | "recruiter";
	loading: boolean;
	search: string;
	setSearch: (value: string) => void;
	sort: (sortBy: string) => void;
	blockUser: (userId: string, block: boolean) => void;
	viewProfile: (userId: string) => void;
	pageData: {
		page: number;
		totalPages: number;
		setPage: (page: number, user: "student" | "recruiter") => void;
	};
};

export interface ProblemPagePropType {
	data: ProblemListType[];
	userLevel: "student" | "admin";
	loading: boolean;
	search: string;
	setSearch: (value: string) => void;
	sort: (sortBy: string) => void;
	pageData: {
		page: number;
		totalPages: number;
		setPage: (page: number) => void;
	};
}

export type JobSearchProps = {
	search: string;
	setSearch: (value: string) => void;
	sort: "Newest" | "Oldest";
	setSort: (value: "Newest" | "Oldest") => void;
	// popoverOpen: boolean;
	// setPopoverOpen: (value: boolean) => void;
	// recruiterSearch: string;
	// setRecruiterSearch: (value: string) => void;
	// recruiterQuery: { companyName: string; userId: string };
	// setRecruiterQuery: (value: { companyName: string; userId: string }) => void;
	// recruiters: { companyName: string; userId: string }[];
	loading: boolean;
};

export type JobCardProps = {
	_id: string;
	companyName: string;
	profilePicture: string;
	role: string;
	workTime: string;
	workMode: string;
	jobLocation: string;
	minSalary?: number;
	maxSalary?: number;
	minimumExperience: number;
	lastDate: Date;
	createdAt: Date;
	url?: string;
};

export type AppliationDrawerProps = {
	applications: ApplicationWithJob[];
	setApplications: (applications: ApplicationWithJob[]) => void;
	pageData: { page: number; totalPages: number };
	setPage: (page: number) => void;
};

export type SelectButtonProps = {
	label: string;
	width?: string;
	placeholder: string;
	values: { value: string; display: string }[];
	state: string;
	setState: (value: string) => void;
};

export type PricingCardProps = {
	_id: string;
	name: string;
	price: string;
	maxInterviews: number;
	durationInDays: number;
	highlight?: boolean;
	listed: boolean;
	userLevel: "admin" | "recruiter";
};
