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
import PostJob from "@/pages/recruiter/PostJob";
import MyJobs from "@/pages/recruiter/MyJobs";
import JobDetails from "@/pages/recruiter/JobDetails";
import EditPost from "@/pages/recruiter/EditPost";
import Applications from "@/pages/recruiter/Applications";
import ApplicationDetails from "@/pages/recruiter/ApplicationDetails";
import Interview from "@/pages/recruiter/Interview";
import Subscriptions from "@/pages/recruiter/Subscriptions";
import PaymentSuccess from "@/pages/recruiter/PaymentSuccess";

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
				<Route path="/" element={<Home />} />

				<Route
					path="/login"
					element={
						<Navigate to={`/recruiter${recruiterRoutes.SIGNIN}`} />
					}
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
				<Route
					path={recruiterRoutes.POST_JOB}
					element={
						<ProtectRoute>
							<PostJob />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.JOBS}
					element={
						<ProtectRoute>
							<MyJobs />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.JOB_DETAILS}
					element={
						<ProtectRoute>
							<JobDetails />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.EDIT_POST}
					element={
						<ProtectRoute>
							<EditPost />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.APPLICATIONS}
					element={
						<ProtectRoute>
							<Applications />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.APPLICATION_DETILAILS}
					element={
						<ProtectRoute>
							<ApplicationDetails />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.INTERVIEW}
					element={
						<ProtectRoute>
							<Interview />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.SUBSCRIPTIONS}
					element={
						<ProtectRoute>
							<Subscriptions />
						</ProtectRoute>
					}
				/>
				<Route
					path={recruiterRoutes.PAYMENT_SUCCESS}
					element={
						<ProtectRoute>
							<PaymentSuccess />
						</ProtectRoute>
					}
				/>
			</Routes>
		</>
	);
};

export default RecruiterRoutes;
