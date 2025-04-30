import {
	getApplcationDetails,
	getResumeUrl,
	removeFromShortlist,
	scheduleInterview,
	shortlistSingleApplication,
} from "@/api/recruiter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/types/types";
import { DatePicker } from "@heroui/date-picker";
import { fromDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ApplicationDetails = () => {
	const location = useLocation();
	const { state } = location || {};

	const { toast } = useToast();

	const navigate = useNavigate();

	const [application, setApplication] = useState<Application>({
		_id: "",
		name: "",
		email: "",
		phone: "",
		yearOfExperience: 0,
		summary: "",
		skills: [],
		education: [],
		experience: [],
	});
	const [shortlisted, setShortlisted] = useState(
		state.shortlisted as boolean
	);
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(fromDate(new Date(), "IST"));
	const [error, setError] = useState("");
	useEffect(() => {
		if (!state) {
			navigate(-1);
		}
	}, []);

	const handleSchedule = async () => {
		const selectedDate = date.toDate();
		const meetingTime = new Date(selectedDate);

		if (meetingTime <= new Date()) {
			setError("Please select a future date and time.");
			return;
		} else {
			setError("");
		}
		setLoading(true);
		const response = await scheduleInterview({
			meetingTime,
			candidateEmail: application.email,
		});

		if (response.success) {
			navigator.clipboard
				.writeText(
					window.location.protocol +
						"//" +
						window.location.host +
						recruiterRoutes.MEETING +
						"?roomID=" +
						response.data.meetingId
				)
				.then(() => {
					toast({
						description: "Meet link copied to clipboard",
					});
				});
			setLoading(false);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await getApplcationDetails(
				state.jobId,
				state.applicationId
			);

			if (response.success) {
				setApplication(response.data);
				setLoading(false);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading(false);
			}
		})();
	}, []);

	const handleShorlisting = async () => {
		const fetchFunction = shortlisted
			? removeFromShortlist
			: shortlistSingleApplication;

		const response = await fetchFunction(state.jobId, state.applicationId);

		if (response.success) {
			toast({
				description: response.data.message,
			});
			setShortlisted((prev) => !prev);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	const handleResumeDownload = async () => {
		const response = await getResumeUrl(state.jobId, state.applicationId);

		if (response.success) {
			window.open(response.data.url, "_blank");
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};
	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[
					{
						component: "My jobs",
						path: `/recruiter${recruiterRoutes.JOBS}`,
					},
					{ component: state.role },
					{ component: "Applications", path: -1 },
					{ component: state.name },
				]}
			/>

			<div className="min-h-screen px-6 py-10">
				<Card className="dark:border-[#f7e9c8] border-black">
					<CardContent className="p-6 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h2 className="text-xl font-semibold">Name</h2>
								<p>{application.name}</p>
							</div>
							<div>
								<h2 className="text-xl font-semibold">Email</h2>
								<p>{application.email}</p>
							</div>
							<div>
								<h2 className="text-xl font-semibold">Phone</h2>
								<p>{application.phone}</p>
							</div>
							<div>
								<h2 className="text-xl font-semibold">
									Years of Experience
								</h2>
								<p>{application.yearOfExperience}</p>
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-1">
								Summary
							</h2>
							<p>{application.summary}</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-1">
								Skills
							</h2>
							<div className="flex flex-wrap gap-2">
								{application.skills.map((skill, idx) => (
									<Badge
										key={idx}
										variant="outline"
										className="dark:border-[#f7e9c8] border-black"
									>
										{skill}
									</Badge>
								))}
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-1">
								Education
							</h2>
							<div className="space-y-3">
								{application.education.map((edu, idx) => (
									<div
										key={idx}
										className="border dark:border-[#f7e9c8] border-black p-3 rounded-md"
									>
										<p>
											<span className="font-semibold">
												University:
											</span>{" "}
											{edu.university}
										</p>
										<p>
											<span className="font-semibold">
												Degree:
											</span>{" "}
											{edu.degree}
										</p>
										<p>
											<span className="font-semibold">
												Graduation Year:
											</span>{" "}
											{edu.graduationYear}
										</p>
										<p>
											<span className="font-semibold">
												CGPA:
											</span>{" "}
											{edu.cgpa}
										</p>
									</div>
								))}
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-1">
								Experience
							</h2>
							<div className="space-y-3">
								{application.experience.map((exp, idx) => (
									<div
										key={idx}
										className="border dark:border-[#f7e9c8] border-black p-3 rounded-md"
									>
										<p>
											<span className="font-semibold">
												Company:
											</span>{" "}
											{exp.company}
										</p>
										<p>
											<span className="font-semibold">
												Title:
											</span>{" "}
											{exp.title}
										</p>
										<p>
											<span className="font-semibold">
												Location:
											</span>{" "}
											{exp.location}
										</p>
										<p>
											<span className="font-semibold">
												Dates:
											</span>{" "}
											{exp.dates}
										</p>
									</div>
								))}
							</div>
						</div>

						<div className="md:flex md:max-w-3xl justify-around items-center">
							<Button
								className={`${
									!shortlisted ? "bg-mildgreen" : ""
								} w-full md:w-auto`}
								variant={
									shortlisted ? "destructive" : "default"
								}
								disabled={loading}
								onClick={handleShorlisting}
							>
								{loading ? (
									<ClassicSpinner />
								) : shortlisted ? (
									"Remove From Shortlist"
								) : (
									"Add To Shortlist"
								)}
							</Button>
							<Button
								className="bg-bluegrey mt-4 md:mt-0 w-full md:w-auto"
								disabled={loading}
								onClick={handleResumeDownload}
							>
								{loading ? (
									<ClassicSpinner />
								) : (
									"Download Resume"
								)}
							</Button>
							<Button
								className="bg-mildgreen mt-4 md:mt-0 w-full md:w-auto"
								disabled={loading}
								onClick={handleSchedule}
							>
								{loading ? (
									<ClassicSpinner />
								) : (
									"Shedule Interview"
								)}
							</Button>
							<DatePicker
								className="max-w-[284px] md:ml-4"
								value={date}
								onChange={(value) =>
									setDate(
										value ?? fromDate(new Date(), "IST")
									)
								}
								onClick={handleSchedule}
							/>
							<p className="text-red-500 ml-3">{error}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ApplicationDetails;
