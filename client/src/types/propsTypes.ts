import { RecruiterData, StudentData } from "./formTypes";

export interface BreadcrumbPropType {
  components: { component: string; path?: string }[];
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
  pageData: {page: number, totalPages: number, setPage: (page: number, user: "student" | "recruiter") => void};
}