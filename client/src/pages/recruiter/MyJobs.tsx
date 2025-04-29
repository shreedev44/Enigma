import { getMyJobs } from "@/api/recruiter";
import Breadcrumbs from "@/components/Breadcrumbs";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/loaders/JobCardSkeleton";
import { DynamicPagination } from "@/components/Pagination";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { JobCardProps } from "@/types/propsTypes";
import { useEffect, useState } from "react";

const MyJobs = () => {
	const [jobs, setJobs] = useState<JobCardProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [pageData, setPageData] = useState({ page: 1, totalPages: 1 });

	const { toast } = useToast();

	const setPage = (page: number) => {
		setPageData((prev) => ({ ...prev, page }));
	};

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await getMyJobs(`page=${pageData.page}`);

			if (response.success) {
				setJobs(response.data.jobs);
				setPageData((prev) => ({...prev, totalPages: response.data.totalPages}))
				setLoading(false);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
	}, [pageData.page]);
	return (
		<div className="pt-24">
			<Breadcrumbs components={[{ component: "My jobs" }]} />
			<div className="flex justify-center">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start p-4 md:p-8">
					{loading ? (
						[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)
					) : jobs.length ? (
						jobs.map((job: JobCardProps) => {
							return <JobCard key={job._id} {...{ ...job, url: `/recruiter${recruiterRoutes.JOB_DETAILS}` }} />;
						})
					) : (
						<div className="col-span-full flex justify-center">
							<p className="text-xl font-mono font-bold text-center">
								No jobs yet...
							</p>
						</div>
					)}
				</div>
			</div>
			{jobs.length && !loading ? (
				<DynamicPagination {...pageData} setPage={setPage} />
			) : (
				<></>
			)}
		</div>
	);
};

export default MyJobs;
