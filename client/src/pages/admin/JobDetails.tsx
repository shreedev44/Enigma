import { getJobDetails, hideJob } from "@/api/common";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import JobDetailsSkeleton from "@/components/loaders/JobDetailsSkeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminRoutes } from "@/constants/routeUrl";
import { useSidebarContext } from "@/context/SidebarContext";

const JobDetails = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { jobId } = location.state || {};

	const [loading, setLoading] = useState({
		job: false,
		action: false,
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
	const [listed, setListed] = useState(true);

	useEffect(() => {
		if (!jobId) {
			navigate(adminRoutes.JOBS);
			return;
		}

		(async () => {
			setLoading((prev) => ({ ...prev, job: true }));
			const response = await getJobDetails(jobId, "admin");

			if (response.success) {
				setJob(response.data);
				setListed(response.data.listed);
				setLoading((prev) => ({ ...prev, job: false }));
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading((prev) => ({ ...prev, job: false }));
			}
		})();
	}, [jobId, navigate, toast]);

	const handleUnlistJob = async () => {
		setLoading((prev) => ({ ...prev, action: true }));
		const response = await hideJob(jobId, "admin");

		if (response.success) {
			toast({
				description: response.data.message,
			});
			setListed(false);
			setLoading((prev) => ({ ...prev, action: false }));
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading((prev) => ({ ...prev, action: false }));
		}
	};

    const { setBreadcrumbs } = useSidebarContext();
	useEffect(() => {
		setBreadcrumbs([
			{
				component: "Jobs",
				path: `/admin${adminRoutes.JOBS}`,
			},
			{ component: 'Job details' },
		]);
	}, []);

	return (
		<div className="px-3 md:px-20 pb-10">
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

			{!loading.job && (
				<section className="mt-10 md:mt-14">
					<p className="text-xl md:text-3xl font-bold font-mono">
						Actions
					</p>
					<div className="mt-4 md:mt-8">
						<Button
							variant={"default"}
							size={"lg"}
							className="bg-red-500 text-white rounded-full"
							onClick={handleUnlistJob}
							disabled={loading.action || !listed}
						>
							{loading.action ? <ClassicSpinner /> : "Unlist Job"}
						</Button>
					</div>
				</section>
			)}
		</div>
	);
};

export default JobDetails;
