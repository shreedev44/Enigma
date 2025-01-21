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

const RecruiterRoutes = () => {
  const user = useGetRecruiter();
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? `/recruiter${recruiterRoutes.HOME}`
                  : `/recruiter${recruiterRoutes.SIGNIN}`
              }
            />
          }
        />
        <Route
          path="/login"
          element={<Navigate to={`/recruiter${recruiterRoutes.SIGNIN}`} />}
        />
        <Route
          path={recruiterRoutes.SIGNIN}
          element={
            user ? (
              <Navigate to={`/recruiter${recruiterRoutes.HOME}`} />
            ) : (
              <SignIn />
            )
          }
        />
        <Route
          path={recruiterRoutes.SIGNUP}
          element={
            user ? (
              <Navigate to={`/recruiter${recruiterRoutes.HOME}`} />
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path={recruiterRoutes.VERIFY_OTP}
          element={
            user ? (
              <Navigate to={`/recruiter${recruiterRoutes.HOME}`} />
            ) : (
              <Otp />
            )
          }
        />
        <Route
          path={recruiterRoutes.FORGOT_PASSWORD}
          element={
            user ? (
              <Navigate to={`/recruiter${recruiterRoutes.HOME}`} />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route
          path={recruiterRoutes.RESET_PASSWORD}
          element={
            user ? (
              <Navigate to={`/recruiter${recruiterRoutes.HOME}`} />
            ) : (
              <ResetPassword />
            )
          }
        />
        <Route
          path={recruiterRoutes.HOME}
          element={
            user ? (
              <Home />
            ) : (
              <Navigate to={`/recruiter${recruiterRoutes.SIGNIN}`} />
            )
          }
        />
      </Routes>
    </>
  );
};

export default RecruiterRoutes;
