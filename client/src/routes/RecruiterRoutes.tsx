import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/recruiterComponents/Navbar";
import { recruiterRoutes } from "@/constants/routeUrl";
import useGetRecruiter from "../hooks/useGetRecruiter";

import SignIn from "@/pages/recruiter/SignIn";
import Signup from "@/pages/recruiter/Signup";
import Home from "@/pages/recruiter/Home";
import Otp from "@/pages/recruiter/Otp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/recruiter/Profile";

const RecruiterRoutes = () => {
  const ProtectRoute = ({ children }: { children: JSX.Element }) => {
    const user = useGetRecruiter();
    return user ? (
      children
    ) : (
      <Navigate to={`/recruiter${recruiterRoutes.SIGNIN}`} />
    );
  };
  const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const user = useGetRecruiter();
    return user ? (
      <Navigate to={`/recruiter${recruiterRoutes.HOME}`} />
    ) : (
      children
    );
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

        <Route
          path="/login"
          element={<Navigate to={`/recruiter${recruiterRoutes.SIGNIN}`} />}
        />
        <Route
          path={recruiterRoutes.SIGNIN}
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path={recruiterRoutes.SIGNUP}
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path={recruiterRoutes.VERIFY_OTP}
          element={
            <PublicRoute>
              <Otp />
            </PublicRoute>
          }
        />
        <Route
          path={recruiterRoutes.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path={recruiterRoutes.RESET_PASSWORD}
          element={<ResetPassword />}
        />
        <Route
          path={recruiterRoutes.HOME}
          element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          }
        />
        <Route
          path={recruiterRoutes.PROFILE}
          element={
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
};

export default RecruiterRoutes;
