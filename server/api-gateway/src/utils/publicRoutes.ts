import { Request } from "express";

const PUBLIC_ROUTES: { method: string; path: string }[] = [
  { method: "POST", path: "/auth/student/register" },
  { method: "POST", path: "/auth/recruiter/register" },
  { method: "POST", path: "/auth/verifyOtp" },
  { method: "POST", path: "/auth/resendOtp" },
  { method: "POST", path: "/auth/signin" },
  { method: "POST", path: "/auth/googleAuth" },
  { method: "POST", path: "/auth/githubAuth" },
  { method: "POST", path: "/auth/changePassword" },
  { method: "PATCH", path: "/auth/resetPassword" },
  { method: "POST", path: "/auth/refreshToken" },
  { method: "GET", path: "/problem/student/getProblems" },
  { method: "GET", path: "/problem/student/findProblem" },
  { method: "POST", path: "/problem/student/compile" },
];

export function isPublic(req: Request): boolean {
  return PUBLIC_ROUTES.some(({method, path}) => {
    return method === req.method && req.path.includes(path)
  })
}
