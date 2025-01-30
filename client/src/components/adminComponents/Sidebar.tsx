import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { removeAdmin } from "@/redux/adminSlice";
import { useDispatch } from "react-redux";
import { useGetUserData } from "@/hooks/useGetAdmin";
import { useToast } from "@/hooks/use-toast";
import Messages from "@/constants/Messages";
import { useTheme } from "../../context/ThemeContext";
import Breadcrumbs from "../Breadcrumbs";
import { adminRoutes } from "@/constants/routeUrl";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { name } = useGetUserData();

  const handleLogout = () => {
    dispatch(removeAdmin());
    toast({
      description: Messages.LOGOUT_SUCCESS,
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar
        theme={theme}
        handleLogout={handleLogout}
        toggleTheme={toggleTheme}
        user={name || "admin"}
      />
      <main>
        <div className="flex justify-start items-center">
          <SidebarTrigger />
          <Breadcrumbs
            components={[
              { component: "Dashboard", path: `/admin${adminRoutes.HOME}` },
            ]}
          />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Sidebar;
