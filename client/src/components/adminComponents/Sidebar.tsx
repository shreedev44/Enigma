import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { removeAdmin } from "@/redux/adminSlice";
import { useDispatch } from "react-redux";
import { useGetAdminData } from "@/hooks/useGetAdmin";
import { useToast } from "@/hooks/use-toast";
import Messages from "@/constants/Messages";
import { useTheme } from "../../context/ThemeContext";
import Breadcrumbs from "../Breadcrumbs";
import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { adminRoutes } from "@/constants/routeUrl";
import { forgotPassword } from "@/api/common";
// import { logout } from "@/api/admin";

const SidebarContext = createContext<{
	setBreadcrumbs: (
		breadcrumbs: { component: string; path?: string | undefined }[]
	) => void;
} | null>(null);
export const useSidebarContext = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error(
			"useSidebarContext must be used within SidebarProvider"
		);
	}
	return context;
};

const Sidebar = () => {
	const { theme, toggleTheme } = useTheme();
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { name, email } = useGetAdminData();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(removeAdmin());
		toast({
			description: Messages.LOGOUT_SUCCESS,
		});
		navigate(`/admin${adminRoutes.SIGNIN}`);
		// logout();
	};

	const changePassword = async () => {
		const response = await forgotPassword(email, "admin");

		if (response.success) {
			toast({
				description: "Your password reset link was sent to your email",
			});
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	const [breadcrumbs, setBreadcrumbs] = useState([{ component: "" }]);

	return (
		<SidebarProvider>
			<SidebarContext.Provider value={{ setBreadcrumbs }}>
				<AppSidebar
					theme={theme}
					handleLogout={handleLogout}
					toggleTheme={toggleTheme}
					user={name || "admin"}
					changePassword={changePassword}
				/>
				<main className="px-5 pt-5 w-full">
					<div className="flex justify-start items-center">
						<SidebarTrigger />
						<Breadcrumbs components={breadcrumbs} />
					</div>

					<Outlet />
				</main>
			</SidebarContext.Provider>
		</SidebarProvider>
	);
};

export default Sidebar;
