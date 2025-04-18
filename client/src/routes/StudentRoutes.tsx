import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/studentComponents/Navbar";
import GitHubCallback from "@/components/studentComponents/GithubAuth";
import { studentRoutes } from "../constants/routeUrl";
import useGetUser from "@/hooks/useGetStudent";

import SignIn from "@/pages/student/SignIn";
import Signup from "@/pages/student/Signup";
import Home from "@/pages/student/Home";
import Otp from "@/pages/student/Otp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/student/Profile";
import ProblemSet from "@/pages/student/ProblemSet";
import Problem from "@/pages/student/Problem";
import Compiler from "@/pages/student/Compiler";

const StudentRoutes = () => {
  const ProtectRoute = ({ children }: { children: JSX.Element }) => {
    const user = useGetUser();
    return user ? children : <Navigate to={studentRoutes.SIGNIN} />;
  };
  const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const user = useGetUser();
    return user ? <Navigate to={studentRoutes.HOME} /> : children;
  };
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          }
        />
        <Route path="/login" element={<Navigate to={studentRoutes.SIGNIN} />} />
        <Route
          path={studentRoutes.SIGNIN}
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path={studentRoutes.SIGNUP}
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path={studentRoutes.VERIFY_OTP}
          element={
            <PublicRoute>
              <Otp />
            </PublicRoute>
          }
        />
        <Route
          path={studentRoutes.GITHUB_AUTH}
          element={
            <PublicRoute>
              <GitHubCallback />
            </PublicRoute>
          }
        />
        <Route
          path={studentRoutes.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path={studentRoutes.RESET_PASSWORD}
          element={<ResetPassword />}
        />
        <Route
          path={studentRoutes.HOME}
          element={
            <Home />
          }
        />
        <Route
          path={studentRoutes.PROFILE}
          element={
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          }
        />
        <Route
          path={studentRoutes.PROBLEM_SET}
          element={
            <ProblemSet />
          }
        />
        <Route
          path={studentRoutes.PROBLEM + '/:problemNo'}
          element={
            <Problem />
          }
        />
        <Route
          path={studentRoutes.COMPILER}
          element={
            <Compiler />
          }
        />
      </Routes>
    </>
  );
};

export default StudentRoutes;
