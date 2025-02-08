import { Navigate, Route, Routes } from "react-router-dom";
import { adminRoutes } from "@/constants/routeUrl";
import useGetAdmin from "@/hooks/useGetAdmin";

import SignIn from "@/pages/admin/SignIn";
import Dashboard from "@/pages/admin/Dashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Sidebar from "@/components/adminComponents/Sidebar";
import Users from "@/pages/admin/Users";

const AdminRoutes = () => {
  const ProtectRoute = ({ children }: { children: JSX.Element }) => {
    const user = useGetAdmin();
    return user ? children : <Navigate to={`/admin${adminRoutes.SIGNIN}`} />;
  };
  const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const user = useGetAdmin();
    return user ? <Navigate to={`/admin${adminRoutes.HOME}`} /> : children;
  };
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />

        <Route
          path="/login"
          element={<Navigate to={`/admin${adminRoutes.SIGNIN}`} />}
        />
        <Route
          path={adminRoutes.SIGNIN}
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path={adminRoutes.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path={adminRoutes.RESET_PASSWORD}
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route element={<Sidebar />}>
          <Route
            path={adminRoutes.HOME}
            element={
              <ProtectRoute>
                <Dashboard />
              </ProtectRoute>
            }
          />
          <Route
            path={adminRoutes.STUDENTS}
            element={
              <ProtectRoute>
                <Users user="student" />
              </ProtectRoute>
            }
          />
          <Route
            path={adminRoutes.RECRUITERS}
            element={
              <ProtectRoute>
                <Users user="recruiter" />
              </ProtectRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoutes;
