import Breadcrumbs from "@/components/Breadcrumbs";
import SelectButton from "@/components/SelectButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Requirements from "@/components/recruiterComponents/Requirements";
import Responsibilities from "@/components/recruiterComponents/Responsibilities";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import jobImage from "@/assets/interview.jpg";
import { useToast } from "@/hooks/use-toast";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { Job } from "@/types/types";
import { objectDiff } from "@/utils/objectDiff";
import { validateForm } from "@/validation/formValidation";
import { jobUpdationValidationSchema } from "@/validation/formSchema";
import { updateJob } from "@/api/recruiter";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";

const EditPost = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { state } = location;
	const { job, jobId }: { job: Job; jobId: string } = state || {};

	const [role, setRole] = useState(job.role);
	const [workTime, setWorkTime] = useState<string>(job.workTime);
	const [workMode, setWorkMode] = useState<string>(job.workMode);
	const [jobLocation, setJobLocation] = useState(job.jobLocation);
	const [minimumExperience, setMinExperience] = useState(
		String(job.minimumExperience)
	);
	const [minSalary, setMinSalary] = useState(String(job.minSalary));
	const [maxSalary, setMaxSalary] = useState(String(job.maxSalary));
	const [requirements, setRequirements] = useState<string[]>(
		job.requirements
	);
	const [responsibilities, setResponsibilities] = useState<string[]>(
		job.responsibilities
	);
	const [lastDate, setLastDate] = useState<Date>(job.lastDate);
	const [error, setError] = useState({ field: "", message: "" });
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();

	const handleSubmit = async () => {
		const form = {
			role,
			workTime,
			workMode,
			jobLocation,
			minimumExperience,
			requirements,
			responsibilities,
			lastDate,
		};
		let newForm: typeof form & { minSalary?: string; maxSalary?: string } =
			{
				...form,
			};

		if (minSalary) {
			newForm = { ...form, minSalary, maxSalary };
		}
		const differenceObj = objectDiff(
			{
				...job,
				userId: undefined,
				companyName: undefined,
				profilePicture: undefined,
				createdAt: undefined,
				listed: undefined,
				minSalary: String(minSalary),
				maxSalary: String(maxSalary),
				minimumExperience: String(minimumExperience),
			},
			newForm
		);

		if (differenceObj) {
      const transformedDifferenceObj = Object.fromEntries(
        Object.entries(differenceObj).map(([key, value]) => [key, value.new])
      );
			const error = validateForm(
				jobUpdationValidationSchema,
				transformedDifferenceObj
			);
			if (error) {
				setError(error);
				return;
			}
			setLoading(true);
			const response = await updateJob(jobId, transformedDifferenceObj);

			if (response.success) {
				toast({
					description: response.data.message,
				});
				setLoading(false);
				navigate(-1);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading(false);
			}
		} else {
      navigate(-1)
    }
	};

	useEffect(() => {
		if (!job || !jobId) {
			navigate(`/recruiter${recruiterRoutes.JOBS}`);
			return;
		}
	}, [job, jobId]);
	return (
		<div className="pt-24" key={jobId}>
			<Breadcrumbs
				components={[
					{
						component: "My Jobs",
						path: `/recruiter${recruiterRoutes.JOBS}`,
					},
					{ component: `Edit ${job.role}` },
				]}
			/>
			<div className="min-h-screen px-3 md:px-14 py-12 flex">
				<div className="w-full md:w-1/2">
					<h1 className="text-3xl font-bold font-mono mb-10">
						Edit Post
					</h1>

					<form
						className="space-y-8 max-w-2xl md:pl-4"
						onSubmit={(e) => e.preventDefault()}
					>
						<div className="space-y-2">
							<Label htmlFor="role">Role</Label>
							<Input
								id="role"
								placeholder="Enter role"
								className="border"
								value={role}
								onChange={(e) => setRole(e.target.value)}
							/>
							{error.field === "role" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="workTime">Work Time</Label>
							<div id="workTime">
								<SelectButton
									label="Work Time"
									placeholder="Select a work time"
									values={[
										{
											value: "Full-Time",
											display: "Full-Time",
										},
										{
											value: "Part-Time",
											display: "Part-Time",
										},
									]}
									state={workTime}
									setState={setWorkTime}
								/>
							</div>
							{error.field === "workTime" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="workMode">Work Mode</Label>
							<div id="workMode">
								<SelectButton
									label="Work Mode"
									placeholder="Select a work mode"
									values={[
										{
											value: "On-Site",
											display: "On-Site",
										},
										{ value: "Remote", display: "Remote" },
										{ value: "Hybrid", display: "Hybrid" },
									]}
									state={workMode}
									setState={setWorkMode}
								/>
							</div>
							{error.field === "workMode" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="jobLocation">Job Location</Label>
							<Input
								id="jobLocation"
								placeholder="Enter location"
								className="border"
								value={jobLocation}
								onChange={(e) => setJobLocation(e.target.value)}
							/>
							{error.field === "jobLocation" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="experience">
								Minimum Experience Required (years)
							</Label>
							<Input
								id="experience"
								placeholder="Enter experience"
								type="number"
								className="border"
								value={minimumExperience}
								onChange={(e) =>
									setMinExperience(e.target.value)
								}
							/>
							{error.field === "minimumExperience" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label>Salary (LPA)</Label>
							<div className="flex gap-4">
								<div className="flex flex-col gap-2 flex-1">
									<span className="text-sm">Min</span>
									<Input
										placeholder="Min"
										type="number"
										className="border"
										value={minSalary}
										onChange={(e) =>
											setMinSalary(e.target.value)
										}
									/>
									{error.field === "minSalary" && (
										<p className="text-red-500 text-sm">
											{error.message}
										</p>
									)}
								</div>
								<div className="flex flex-col gap-2 flex-1">
									<span className="text-sm">Max</span>
									<Input
										placeholder="Max"
										type="number"
										className="border"
										value={maxSalary}
										onChange={(e) =>
											setMaxSalary(e.target.value)
										}
									/>
									{error.field === "maxSalary" && (
										<p className="text-red-500 text-sm">
											{error.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<Requirements
							requirements={requirements}
							setRequirements={setRequirements}
						/>
						{error.field === "requirements" && (
							<p className="text-red-500 text-sm">
								{error.message}
							</p>
						)}

						<Responsibilities
							responsibilities={responsibilities}
							setResponsibilities={setResponsibilities}
						/>
						{error.field === "responsibilities" && (
							<p className="text-red-500 text-sm">
								{error.message}
							</p>
						)}

						<div className="space-y-2">
							<Label htmlFor="lastDate">
								Last date to apply for this role
							</Label>
							<div className="lastDate">
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] justify-start text-left font-normal",
												!lastDate &&
													"text-muted-foreground"
											)}
										>
											<CalendarIcon />
											{lastDate ? (
												format(lastDate, "PPP")
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
											selected={lastDate}
											onSelect={(day) =>
												day && setLastDate(day)
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							{error.field === "lastDate" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>
						<Button
							className="bg-mildgreen rounded-full px-10 font-bold font-mono"
							size={"lg"}
							onClick={handleSubmit}
              disabled={loading}
						>
							{loading ? <ClassicSpinner /> : "Save"}
						</Button>
					</form>
				</div>

				<div className="hidden md:block md:w-1/2 relative">
					<img
						src={jobImage}
						alt="Job Posting"
						className="fixed top-32 right-14 w-2/5 object-cover rounded-2xl"
					/>
				</div>
			</div>
		</div>
	);
};

export default EditPost;
