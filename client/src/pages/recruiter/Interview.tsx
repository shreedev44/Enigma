import Breadcrumbs from "@/components/Breadcrumbs";
import interviewImage1 from "@/assets/interview.jpg";
import interviewImage2 from "@/assets/interview.png";
import { Button } from "@/components/ui/button";
import { Time } from "@internationalized/date";
import { TimeInput } from "@heroui/date-input";
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { scheduleInterview } from "@/api/recruiter";
import { useNavigate } from "react-router-dom";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";

const Interview = () => {
	const [date, setDate] = useState(new Date(Date.now()));
	const [time, setTime] = useState(
		new Time(date.getHours(), date.getMinutes())
	);
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { toast } = useToast();

	const handleInstantMeeting = async () => {
		const meetingTime = new Date(Date.now());
		const response = await scheduleInterview({ meetingTime });

		if (response.success) {
			navigate(recruiterRoutes.MEETING, {
				state: {
					meetingId: response.data.meetingId,
				},
			});
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	const handleSchedule = async () => {
		const meetingTime = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			time.hour,
			time.minute
		);

		if (meetingTime <= new Date()) {
			setError("Please select a future date and time.");
			return;
		}

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
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
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
							>
								Start an instant meeting
							</Button>
							<Button
								className="bg-mildgreen w-full md:w-auto mt-3 md:mt-0 md:ml-2 font-bold font-mono"
								onClick={handleSchedule}
							>
								Schedule a meeting
							</Button>
							<div className="flex max-w-xs justify-around mt-5">
								<TimeInput
									value={time}
									onChange={(value) => setTime(value as Time)}
									label={null}
									className="max-w-24"
								/>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-[180px] justify-start text-left dark:text-white font-normal",
												!date && "text-muted-foreground"
											)}
										>
											<CalendarIcon />
											{date ? (
												format(date, "PPP")
											) : (
												<span>Pick a date</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto p-0"
										align="start"
									>
										<Calendar
											mode="single"
											selected={date}
											onSelect={(day) =>
												day && setDate(day)
											}
											autoFocus
										/>
									</PopoverContent>
								</Popover>
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
