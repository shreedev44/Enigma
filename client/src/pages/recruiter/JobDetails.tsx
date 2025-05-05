import { getJobDetails } from "@/api/common";
import { hideJob } from "@/api/common";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import JobDetailsSkeleton from "@/components/loaders/JobDetailsSkeleton";
import { Button } from "@/components/ui/button";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const JobDetails = () => {
	const location = useLocation();
	const { state } = location || {};
	const { toast } = useToast();
	const navigate = useNavigate();

	const [job, setJob] = useState({
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
		listed: true,
		lastDate: new Date(),
		createdAt: new Date(),
	});
	const [loading, setLoading] = useState({ job: false, hide: false });

	useEffect(() => {
		if (!state) {
			navigate(`/recruiter${recruiterRoutes.JOBS}`);
			return;
		}
		(async () => {
			setLoading((prev) => ({ ...prev, job: true }));
			const response = await getJobDetails(state.jobId, "recruiter");

			if (response.success) {
				setJob(response.data);
				setLoading((prev) => ({ ...prev, job: false }));
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading((prev) => ({ ...prev, job: false }));
			}
		})();
	}, []);

	const handleHide = async () => {
		setLoading((prev) => ({ ...prev, hide: true }));
		const response = await hideJob(state.jobId, "recruiter");

		if (response.success) {
			toast({
				description: response.data.message,
			});
			setLoading((prev) => ({ ...prev, hide: false }));
			setJob((prev) => ({ ...prev, listed: false }));
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading((prev) => ({ ...prev, hide: false }));
		}
	};
	return (
		<div className="pt-24 px-3 md:px-20 pb-10">
			<Breadcrumbs
				components={[
					{
						component: "My jobs",
						path: `/recruiter${recruiterRoutes.JOBS}`,
					},
					{ component: job.role },
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
					<div className="flex flex-col md:flex-row justify-around md:max-w-2xl">
						<Button
							className="bg-fleace font-bold font-mono mt-10 rounded-full px-10"
							size={"lg"}
							disabled={!job.listed}
							onClick={() =>
								navigate(
									`/recruiter${recruiterRoutes.EDIT_POST}`,
									{ state: { job, jobId: state.jobId } }
								)
							}
						>
							Edit Post
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									className="font-bold font-mono mt-10 rounded-full px-10"
									size={"lg"}
									variant={"destructive"}
									disabled={!job.listed}
								>
									{loading.hide ? (
										<ClassicSpinner />
									) : (
										"Hide Post"
									)}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										permanently hide your job post and
										cannot be displayed to candidates again.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction onClick={handleHide}>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
						<Button
							className="font-bold font-mono mt-10 rounded-full px-10 bg-mildgreen"
							size={"lg"}
							disabled={!job.listed}
							onClick={() =>
								navigate(
									`/recruiter${recruiterRoutes.APPLICATIONS}`,
									{ state: { role: job.role, jobId: state.jobId } }
								)
							}
						>
							{loading.hide ? (
								<ClassicSpinner />
							) : (
								"View Applications"
							)}
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default JobDetails;
