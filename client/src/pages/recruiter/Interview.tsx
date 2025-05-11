import Breadcrumbs from "@/components/Breadcrumbs";
import interviewImage1 from "@/assets/interview.jpg";
import interviewImage2 from "@/assets/interview.png";
import { Button } from "@/components/ui/button";
import { fromDate } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";
import { useState } from "react";
import { scheduleInterview } from "@/api/recruiter";
import { useNavigate } from "react-router-dom";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";

const Interview = () => {
	const [date, setDate] = useState(fromDate(new Date(), "IST"));
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { toast } = useToast();

	const handleInstantMeeting = async () => {
		const meetingTime = new Date(Date.now());
		setLoading(true);
		const response = await scheduleInterview({ meetingTime });

		if (response.success) {
			navigate(
				recruiterRoutes.MEETING + "?roomID=" + response.data.meetingId,
				{
					state: {
						meetingId: response.data.meetingId,
					},
				}
			);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

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
		const response = await scheduleInterview({ meetingTime });

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

	return (
		<div className="pt-24">
			<Breadcrumbs components={[{ component: "Interview" }]} />
			<div className="flex justify-center pt-10 md:pt-20 px-5 md:px-0">
				<div
					className="flex justify-between items-center rounded-3xl border border-blue-400 
                bg-[#b3b9dc] p-8 md:p-12 text-black max-w-8xl mx-auto mx-5 md:mx-0"
				>
					<div className="w-full md:w-1/2 space-y-6">
						<h1 className="text-3xl md:text-4xl font-semibold leading-snug">
							Evaluate candidates efficiently, <br />
							<span className="font-bold">
								saving time and effort in the
							</span>{" "}
							<span className="font-bold">hiring process.</span>
						</h1>
						<p className="text-sm md:text-base max-w-md font-medium text-black/80">
							Conduct more efficient and effective technical
							interviews with our virtual interview platform.
							Assess candidate's skills, experience, and fit for
							your team through real-time communication and online
							coding challenges.
						</p>

						<div>
							<Button
								className="bg-mildgreen w-full md:w-auto mt-3 md:mt-0 md:ml-2 font-bold font-mono"
								onClick={handleInstantMeeting}
								disabled={loading}
							>
								Start an instant meeting
							</Button>
							<Button
								className="bg-mildgreen w-full md:w-auto mt-3 md:mt-0 md:ml-2 font-bold font-mono"
								onClick={handleSchedule}
								disabled={loading}
							>
								Schedule a meeting
							</Button>
							<div className="flex max-w-xs justify-around items-center gap-4 mt-5 date-picker-div">
								<DatePicker
									className="max-w-[284px] md:ml-4"
									value={date}
									onChange={(value) =>
										setDate(
											value ?? fromDate(new Date(), "IST")
										)
									}
								/>
								{loading && <ClassicSpinner />}
							</div>
							{error && (
								<p className="text-red-500 text-sm mt-1 ml-3">
									Please select a valid time.
								</p>
							)}
						</div>
					</div>

					<div className="hidden md:flex flex-col gap-4 w-1/2 pl-10">
						<img
							src={interviewImage1}
							alt="Interview Room"
							className="rounded-lg object-cover h-48 w-full"
						/>
						<img
							src={interviewImage2}
							alt="Online Interview"
							className="rounded-lg object-cover h-48 w-full"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Interview;
