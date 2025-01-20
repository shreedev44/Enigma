import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/studentComponents/Navbar";
import GitHubCallback from "@/components/studentComponents/GithubAuth";
import { studentRoutes } from "../constants/routeUrl";
import useGetUser from "@/hooks/useGetStudent";

import SignIn from "@/pages/student/SignIn";
import Signup from "@/pages/student/Signup";
import Home from "@/pages/student/Home";
import Otp from "@/pages/student/Otp";

const StudentRoutes = () => {
  const user = useGetUser();
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={user ? studentRoutes.HOME : studentRoutes.SIGNIN} />
          }
        />
        <Route path="/login" element={<Navigate to={studentRoutes.SIGNIN} />} />
        <Route
          path={studentRoutes.SIGNIN}
          element={user ? <Navigate to={studentRoutes.HOME} /> : <SignIn />}
        />
        <Route
          path={studentRoutes.SIGNUP}
          element={user ? <Navigate to={studentRoutes.HOME} /> : <Signup />}
        />
        <Route
          path={studentRoutes.VERIFY_OTP}
          element={user ? <Navigate to={studentRoutes.HOME} /> : <Otp />}
        />
        <Route
          path={studentRoutes.GITHUB_AUTH}
          element={user ? <Navigate to={studentRoutes.HOME} /> : <GitHubCallback />}
        />
        <Route
          path={studentRoutes.HOME}
          element={user ? <Home /> : <Navigate to={studentRoutes.SIGNIN} />}
        />
      </Routes>
    </>
  );
};

export default StudentRoutes;
