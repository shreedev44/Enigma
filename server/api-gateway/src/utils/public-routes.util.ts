import { Request } from "express";

const PUBLIC_ROUTES: { method: string; path: string }[] = [
  { method: "POST", path: "/auth/student/register" },
  { method: "POST", path: "/auth/recruiter/register" },
  { method: "POST", path: "/auth/verify-otp" },
  { method: "POST", path: "/auth/resend-otp" },
  { method: "POST", path: "/auth/signin" },
  { method: "POST", path: "/auth/google-auth" },
  { method: "POST", path: "/auth/github-auth" },
  { method: "POST", path: "/auth/change-password" },
  { method: "PATCH", path: "/auth/reset-password" },
  { method: "POST", path: "/auth/refresh-token" },
  { method: "GET", path: "/problem/get-problems" },
  { method: "GET", path: "/problem/find-problem" },
  { method: "POST", path: "/problem/compile" },
];

export function isPublic(req: Request): boolean {
  return PUBLIC_ROUTES.some(({method, path}) => {
    return method === req.method && req.path.includes(path)
  })
}
