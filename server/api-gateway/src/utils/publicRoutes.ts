import { Request } from "express";

const PUBLIC_ROUTES: { method: string; path: string }[] = [
  { method: "POST", path: "/auth/register" },
  { method: "POST", path: "/auth/verifyOtp" },
  { method: "POST", path: "/auth/resendOtp" },
  { method: "POST", path: "/auth/signin" },
  { method: "POST", path: "/auth/googleAuth" },
  { method: "POST", path: "/auth/githubAuth" },
  { method: "POST", path: "/auth/changePassword" },
  { method: "PATCH", path: "/auth/resetPassword" },
  { method: "POST", path: "/auth/refreshToken" },
];

export function isPublic(req: Request): boolean {
  return PUBLIC_ROUTES.some(
    (request) => request.method === req.method && request.path === req.path
  );
}
