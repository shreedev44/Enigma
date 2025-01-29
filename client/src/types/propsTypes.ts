export interface BreadcrumbPropType {
    components: {component: string, path?: string}[]
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