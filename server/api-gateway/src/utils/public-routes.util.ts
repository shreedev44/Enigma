import { Request } from "express";

const MONGODB_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const PUBLIC_ROUTES: { method: string; path: string }[] = [
    { method: "POST", path: "/api/auth/student/register" },
    { method: "POST", path: "/api/auth/recruiter/register" },
    { method: "POST", path: "/api/auth/verify-otp" },
    { method: "POST", path: "/api/auth/resend-otp" },
    { method: "POST", path: "/api/auth/signin" },
    { method: "POST", path: "/api/auth/google-auth" },
    { method: "POST", path: "/api/auth/github-auth" },
    { method: "POST", path: "/api/auth/change-password" },
    { method: "PATCH", path: "/api/auth/reset-password" },
    { method: "POST", path: "/api/auth/refresh-token" },
    { method: "GET", path: "/api/problem/get-problems" },
    { method: "GET", path: "/api/problem/find-problem/:problemId" },
    { method: "POST", path: "/api/problem/compile" },
    { method: "GET", path: "/api/problem/leaderboard/update-ranks" },
    { method: "GET", path: "/api/problem/leaderboard" },
    { method: "GET", path: "/api/problem/leaderboard/top-three" },
    { method: "GET", path: "/api/job/:id" },
    { method: "POST", path: "/api/job/webhook/stripe" },
];

export function isPublic(req: Request): boolean {
    const requestPath = req.path.split("?")[0];
    
    return PUBLIC_ROUTES.some(({ method, path }) => {
        if (method !== req.method) return false;

        const routeSegments = path.split("/").filter(Boolean);
        const requestSegments = requestPath.split("/").filter(Boolean);
        if (requestSegments.length === routeSegments.length - 1 && 
            routeSegments[routeSegments.length - 1].startsWith(":") && 
            req.originalUrl.includes("?")) {
            for (let i = 0; i < requestSegments.length; i++) {
                if (requestSegments[i] !== routeSegments[i]) {
                    return false;
                }
            }
            return true;
        }

        if (routeSegments.length !== requestSegments.length) return false;

        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const requestSegment = requestSegments[i];

            if (routeSegment.startsWith(":")) {
                if (MONGODB_ID_REGEX.test(requestSegment)) {
                    continue;
                }
                return false;
            }

            if (routeSegment !== requestSegment) return false;
        }
        return true;
    });
}