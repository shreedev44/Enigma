import { getJobDetails } from "@/api/common";
import { applyForJob, getRecruiter } from "@/api/student";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import JobDetailsSkeleton from "@/components/loaders/JobDetailsSkeleton";
import JobRecruiterSkeleton from "@/components/loaders/JobRecruiterSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { studentRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/types";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const JobDetails = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { jobId } = location.state || {};

	const [loading, setLoading] = useState({
		job: false,
		recruiter: false,
		apply: false,
	});
	const [job, setJob] = useState<Job>({
		userId: "",
		companyName: "",
		profilePicture: "",
		role: "",
		workTime: "Full-Time",
		workMode: "On-Site",
		jobLocation: "",
		minimumExperience: 0,
		minSalary: 0,
		maxSalary: 0,
		requirements: [],
		responsibilities: [],
		lastDate: new Date(),
		createdAt: new Date(),
	});
	const [recruiter, setRecruiter] = useState<{
		companyName: string;
		bio: string;
		profilePicture: string;
	}>({
		companyName: "",
		bio: "",
		profilePicture: "",
	});

	useEffect(() => {
		if (!jobId) {
			navigate(studentRoutes.JOBS);
			return;
		}

		(async () => {
			setLoading((prev) => ({ ...prev, recruiter: true, job: true }));
			const response = await getJobDetails(jobId, 'student');

			if (response.success) {
				setJob(response.data);
				setLoading((prev) => ({ ...prev, job: false }));
				const recruiterResp = await getRecruiter(response.data.userId);
				if (recruiterResp.success) {
					setRecruiter(recruiterResp.data);
					setLoading((prev) => ({ ...prev, recruiter: false }));
				} else {
					toast({
						description: recruiterResp.error,
						variant: "destructive",
					});
					setLoading((prev) => ({ ...prev, recruiter: false }));
				}
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading((prev) => ({ ...prev, job: false }));
			}
		})();
	}, []);

	const handleApply = async (jobId: string) => {
		const fileInput = document.getElementById("resume") as HTMLInputElement;

		if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
			toast({
				description: "Please upload a resume to apply.",
				variant: "destructive",
			});
			return;
		}

		const file = fileInput.files[0];

		if (file.type !== "application/pdf") {
			toast({
				description: "Only PDF files are allowed.",
				variant: "destructive",
			});
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			toast({
				description: "File size must not exceed 10 MB.",
				variant: "destructive",
			});
			return;
		}

		const formData = new FormData();
		formData.append("resume", file);

        setLoading((prev) => ({...prev, apply: true}))
		const response = await applyForJob(jobId, formData);
        
		if (response.success) {
            toast({
                description: response.data.message,
			});
            setLoading((prev) => ({...prev, apply: false}))
		} else {
            toast({
                description: response.error,
				variant: "destructive",
			});
            setLoading((prev) => ({...prev, apply: false}))
		}
	};

	return (
		<div className="pt-24 px-3 md:px-20 pb-10">
			<Breadcrumbs
				components={[
					{ component: "Jobs", path: studentRoutes.JOBS },
					{ component: `${job.role} at ${job.companyName}` },
				]}
			/>
			{loading.job ? (
				<JobDetailsSkeleton />
			) : (
				<>
					<section className="mt-10">
						<div className="md:flex items-center gap-10">
							<div className="p-5 bg-fleace flex md:w-1/2 justify-around items-center text-white dark:text-black rounded-2xl">
								<p className="text-lg md:text-2xl font-bold font-mono">
									{`${job.role} at ${job.companyName}`}
								</p>
							</div>
							<p className="ml-4 mt-2 md:mt-0">
								Posting closes on{" "}
								{new Date(job.lastDate).toLocaleDateString(
									"en-US",
									{
										weekday: "short",
										month: "short",
										day: "2-digit",
										year: "numeric",
									}
								)}
							</p>
						</div>
					</section>
					<section className="mt-8 md:mt-14">
						<p className="text-xl md:text-3xl font-bold font-mono">
							Job Description
						</p>
						<div className="mt-4 md:mt-8 p-4 bg-bluegrey flex justify-center rounded-2xl text-black md:w-3/4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-sm w-full">
								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Work Time:
									</span>
									<span className="text-lg">
										{job.workTime}
									</span>
								</div>
								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Work Mode:
									</span>
									<span className="text-lg">
										{job.workMode}
									</span>
								</div>

								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Location:
									</span>
									<span className="text-lg">
										{job.jobLocation}
									</span>
								</div>
								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Salary:
									</span>
									<span className="text-lg">
										{job.minSalary
											? `${job.minSalary} - ${job.maxSalary} LPA`
											: "Not Disclosed"}
									</span>
								</div>

								<div className="flex justify-between md:justify-around md:w-1/2 items-center sm:col-span-2">
									<span className="font-semibold text-lg">
										Experience:
									</span>
									<span className="text-lg">
										{job.minimumExperience} or more years
									</span>
								</div>
							</div>
						</div>
					</section>
					<section className="mt-6 md:mt-10">
						<p className="text-lg md:text-xl font-bold font-mono ml-2 md:ml-5">
							Responsibilities
						</p>
						<div className="mt-3 md:mt-6">
							<ul className="list-disc ml-6 md:ml-14">
								{job.responsibilities.map((value, index) => {
									return <li key={index}>{value}</li>;
								})}
							</ul>
						</div>
					</section>
					<section className="mt-6 md:mt-10">
						<p className="text-lg md:text-xl font-bold font-mono ml-2 md:ml-5">
							Requirements
						</p>
						<div className="mt-3 md:mt-6">
							<ul className="list-disc ml-6 md:ml-14">
								{job.requirements.map((value, index) => {
									return <li key={index}>{value}</li>;
								})}
							</ul>
						</div>
					</section>
				</>
			)}

			{loading.recruiter ? (
				<JobRecruiterSkeleton />
			) : (
				<section className="mt-10 md:mt-14">
					<p className="text-xl md:text-3xl font-bold font-mono">
						About the Recruiter
					</p>
					<div className="mt-4 md:mt-8">
						<div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6 p-6 bg-black rounded-2xl max-w-5xl mx-auto">
							{/* <div className="w-20 h-20 bg-[#ece7d6] rounded-full flex-shrink-0 mx-auto md:mx-0" /> */}
							<Avatar className="w-20 h-20 rounded-full flex-shrink-0 mx-auto md:mx-0">
								<AvatarImage
									src={recruiter.profilePicture}
									alt="profile"
								/>
								<AvatarFallback>
									{recruiter.companyName[0]}
								</AvatarFallback>
							</Avatar>
							<div className="text-center md:text-left">
								<h1 className="text-2xl font-bold text-white mb-4">
									{recruiter.companyName}
								</h1>
								<p className="text-gray-300 leading-relaxed text-sm max-w-4xl">
									{recruiter.bio}
								</p>
							</div>
						</div>
					</div>
				</section>
			)}

			{!loading.job && (
				<section className="mt-10 md:mt-14">
					<p className="text-xl md:text-3xl font-bold font-mono">
						Apply to this role
					</p>
					<div className="mt-4 md:mt-8 md:ml-8">
						<p className="text-sm">
							Upload your resume (Ensure it is ATS-friendly).
						</p>
						<ul className="list-disc ml-6 mt-2 text-sm">
							<li>
								Use a simple and clean format without fancy
								designs.
							</li>
							<li>
								Include relevant keywords from the job
								description.
							</li>
							<li>
								Use standard section headings like "Experience"
								and "Education".
							</li>
							<li>Save your resume as a PDF or Word document.</li>
							<li>
								Ensure proper spelling and grammar throughout.
							</li>
						</ul>
						<div className="grid w-full max-w-sm items-center gap-1.5 mt-8">
							<Label htmlFor="resume">Resume (PDF)</Label>
							<Input id="resume" type="file" />
						</div>
						<Button
							variant={"default"}
							size={"lg"}
							className="bg-fleace mt-5 ml-3 rounded-full"
							onClick={() => handleApply(jobId)}
							disabled={loading.apply}
						>
							{loading.apply ? <ClassicSpinner /> : "Apply"}
						</Button>
						{loading.apply ? (
							<p className="ml-3 md:ml-5 text-yellow-500 mt-3">
								This may take a few moment.
							</p>
						) : (
							<></>
						)}
					</div>
				</section>
			)}
		</div>
	);
};

export default JobDetails;
