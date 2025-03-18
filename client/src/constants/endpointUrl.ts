export const studentEndpoints = {
  SIGNUP: "/auth/student/register",
  GOOGLE_AUTH: "/auth/googleAuth",
  GITHUB_AUTH: "/auth/githubAuth",
  FETCH_PROFILE: "/auth/student/getProfile",
  UPDATE_PROFILE: "/auth/student/updateProfile",
  GET_PROBLEMS: "/problem/student/getProblems",
  FIND_PROBLEM: "/problem/student/findProblem",
  COMPILE: "/problem/student/compile",
  RUN_SOLUTION: "/problem/student/run-solution"
};

export const recruiterEndpoints = {
  SIGNUP: "/auth/recruiter/register",
  GOOGLE_AUTH: "/auth/googleAuth",
  FETCH_PROFILE: "/auth/recruiter/getProfile",
  UPDATE_PROFILE: "/auth/recruiter/updateProfile",
};

export const adminEndpoints = {
  FETCH_STUDENTS: "/auth/admin/getStudents",
  FETCH_RECRUITERS: "/auth/admin/getRecruiters",
  BLOCK_ACTION: "/auth/admin/blockOrUnblock",
  ADD_PROBLEM: "/problem/admin/addProblem",
};

export const commonEndpoints = {
  VERIFY_OTP: "/auth/verifyOtp",
  RESEND_OTP: "/auth/resendOtp",
  SIGNIN: "/auth/signin",
  FORGOT_PASSWORD: "/auth/changePassword",
  RESET_PASSWORD: "/auth/resetPassword",
  REFRESH_TOKEN: `${import.meta.env.VITE_BASE_URL}/auth/refreshToken`,
};
