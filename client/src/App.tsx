import { ThemeProvider } from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
import StudentRoutes from "./routes/StudentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import RecruiterRoutes from "./routes/RecruiterRoutes";
import { Toaster } from "@/components/ui/toaster";
import { HeroUIProvider } from "@heroui/react";
import Meeting from "./pages/Meeting";

const App = () => {
	return (
		<ThemeProvider>
			<Toaster />
			<HeroUIProvider>
				<Routes>
					<Route path="/meet" element={<Meeting />} />
					<Route path="/*" element={<StudentRoutes />} />
					<Route path="/admin/*" element={<AdminRoutes />} />
					<Route path="/recruiter/*" element={<RecruiterRoutes />} />
				</Routes>
			</HeroUIProvider>
		</ThemeProvider>
	);
};

export default App;
