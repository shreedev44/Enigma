import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/adminComponents/Navbar";
import { adminRoutes } from "@/constants/routeUrl";
import useGetAdmin from "@/hooks/useGetAdmin";

import SignIn from "@/pages/admin/SignIn";
import Dashboard from "@/pages/admin/Dashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

const AdminRoutes = () => {
  const user = useGetAdmin();
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
                  ? `/admin${adminRoutes.HOME}`
                  : `/admin${adminRoutes.SIGNIN}`
              }
            />
          }
        />
        <Route
          path="/login"
          element={<Navigate to={`/admin${adminRoutes.SIGNIN}`} />}
        />
        <Route
          path={adminRoutes.SIGNIN}
          element={
            user ? <Navigate to={`/admin${adminRoutes.HOME}`} /> : <SignIn />
          }
        />
        <Route
          path={adminRoutes.FORGOT_PASSWORD}
          element={
            user ? (
              <Navigate to={`/admin${adminRoutes.HOME}`} />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route
          path={adminRoutes.RESET_PASSWORD}
          element={
            user ? (
              <Navigate to={`/admin${adminRoutes.HOME}`} />
            ) : (
              <ResetPassword />
            )
          }
        />
        <Route
          path={adminRoutes.HOME}
          element={
            user ? (
              <Dashboard />
            ) : (
              <Navigate to={`/admin${adminRoutes.SIGNIN}`} />
            )
          }
        />
      </Routes>
    </>
  );
};

export default AdminRoutes;
