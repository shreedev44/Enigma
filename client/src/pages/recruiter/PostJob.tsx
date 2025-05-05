import Breadcrumbs from "@/components/Breadcrumbs";
import SelectButton from "@/components/SelectButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Requirements from "@/components/recruiterComponents/Requirements";
import Responsibilities from "@/components/recruiterComponents/Responsibilities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import jobImage from "@/assets/interview.jpg";
import { validateForm } from "@/validation/formValidation";
import { jobCreationValidationSchema } from "@/validation/formSchema";
import { postJob } from "@/api/recruiter";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useGetRecruiterData } from "@/hooks/useGetRecruiter";
import { fromDate } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";

const PostJob = () => {
	const [role, setRole] = useState("");
	const [workTime, setWorkTime] = useState("Full-Time");
	const [workMode, setWorkMode] = useState("On-Site");
	const [jobLocation, setJobLocation] = useState("");
	const [minExperience, setMinExperience] = useState("");
	const [minSalary, setMinSalary] = useState("");
	const [maxSalary, setMaxSalary] = useState("");
	const [requirements, setRequirements] = useState<string[]>([]);
	const [responsibilities, setResponsibilities] = useState<string[]>([]);
	const [lastDate, setLastDate] = useState(fromDate(new Date(), "IST"));
	const [error, setError] = useState({ field: "", message: "" });

	const { toast } = useToast();
	const navigate = useNavigate();
	const recruiterData = useGetRecruiterData();

	const handleSubmit = async () => {
		const formattedDate = new Date(lastDate.toDate())
			.toISOString()
			.split("T")[0];
		const form = {
			role,
			workTime,
			workMode,
			jobLocation,
			minimumExperience: minExperience.toString(),
			requirements,
			responsibilities,
			lastDate: formattedDate,
		};
		let newForm: typeof form & { minSalary?: string; maxSalary?: string } =
			{
				...form,
			};

		if (minSalary) {
			newForm = { ...form, minSalary, maxSalary };
		}
		const error = validateForm(jobCreationValidationSchema, newForm);
		if (error) {
			setError(error);
			return;
		}

		if (minSalary && !maxSalary) {
			setError({
				field: "maxSalary",
				message: "Can't provide only min salary",
			});
			return;
		}
		if (maxSalary && !minSalary) {
			setError({
				field: "minSalary",
				message: "Can't provide only max salary",
			});
			return;
		}

		setError({ field: "", message: "" });
		const response = await postJob({
			...newForm,
			companyName: recruiterData.name,
			profilePicture: recruiterData.profilePicture,
		});
		if (response.success) {
			toast({
				description: "Job posted",
			});
			navigate(`/recruiter${recruiterRoutes.JOBS}`);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="pt-24 relative">
			<Breadcrumbs components={[{ component: "Post Job" }]} />
			<div className="min-h-screen px-3 md:px-14 py-12 flex">
				<div className="w-full md:w-1/2">
					<h1 className="text-3xl font-bold font-mono mb-10">
						Post a Job
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
								value={minExperience}
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
								<DatePicker
									className="max-w-[284px] md:ml-4"
									value={lastDate}
									onChange={(value) =>
										setLastDate(
											value ?? fromDate(new Date(), "IST")
										)
									}
									aria-label="284px"
								/>
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
						>
							Post
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

export default PostJob;
