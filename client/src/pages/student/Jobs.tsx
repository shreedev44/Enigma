import { getJobs } from "@/api/student";
import Breadcrumbs from "@/components/Breadcrumbs";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/loaders/JobCardSkeleton";
import { DynamicPagination } from "@/components/Pagination";
import JobSearch from "@/components/studentComponents/JobSearch";

import { studentRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { JobCardProps } from "@/types/propsTypes";
import { useEffect, useState } from "react";

const Jobs = () => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<"Newest" | "Oldest">("Newest");
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [recruiterSearch, setRecruiterSearch] = useState("");
	// const [recruiters, setRecruiters] = useState<string[]>([]);
	const [loading, setLoading] = useState({ jobs: false, recruiters: false });
	const [urlQuery, setUrlQuery] = useState({
		page: "1",
		sortOrder: "1",
		filter: "",
	});
	const [jobs, setJobs] = useState<JobCardProps[]>([]);

	const { toast } = useToast();

	const filteredUrl = (filter = "", page = "1", sortOrder = "1") => {
		if (urlQuery.page !== page) setUrlQuery({ ...urlQuery, page });
		if (urlQuery.sortOrder !== sortOrder)
			setUrlQuery({ ...urlQuery, sortOrder });
		if (urlQuery.filter !== filter) setUrlQuery({ ...urlQuery, filter });

		return new URLSearchParams({
			page,
			sortOrder,
			filter,
		}).toString();
	};

  
	const [pageData, setPageData] = useState({
    page: 1,
		totalPages: 1,
	});
  
  const setPage = (page: number) => {
    setUrlQuery({ ...urlQuery, page: String(page) });
    setPageData({ ...pageData, page });
  };

	const recruiters = ["Apple", "Google", "Facebook", "Netflix", "Amazon"];
	const jobSearchProps = {
		search,
		setSearch,
		sort,
		setSort,
		popoverOpen,
		setPopoverOpen,
		recruiterSearch,
		setRecruiterSearch,
		recruiters,
		loading: loading.recruiters,
	};

	// const jobs = [
	// 	{
	// 		userId: "1234567890",
	// 		companyName: "Apple",
	// 		profilePicture:
	// 			"https://res.cloudinary.com/dgdimswvi/image/upload/v1742275046/profile_pictures/d8q6xwmcfillzuprhgod.png",
	// 		role: "Full Stack Developer",
	// 		workTime: "Full-Time",
	// 		workMode: "Hybrid",
	// 		jobLocation: "Calicut, Kinfra",
	// 		minSalary: 3,
	// 		maxSalary: 5,
	// 		minimumExperience: 1,
	// 		lastDate: new Date("2025-04-30T07:51:17.602+00:00"),
	// 		createdAt: new Date("2025-04-25T07:51:17.602+00:00"),
	// 	},
	// 	{
	// 		userId: "1234567891",
	// 		companyName: "Apple",
	// 		profilePicture:
	// 			"https://res.cloudinary.com/dgdimswvi/image/upload/v1742275046/profile_pictures/d8q6xwmcfillzuprhgod.png",
	// 		role: "Full Stack Developer",
	// 		workTime: "Full-Time",
	// 		workMode: "Hybrid",
	// 		jobLocation: "Calicut, Kinfra",
	// 		minSalary: 3,
	// 		maxSalary: 5,
	// 		minimumExperience: 1,
	// 		lastDate: new Date("2025-04-30T07:51:17.602+00:00"),
	// 		createdAt: new Date("2025-04-25T07:51:17.602+00:00"),
	// 	},
	// 	{
	// 		userId: "1234567892",
	// 		companyName: "Apple",
	// 		profilePicture:
	// 			"https://res.cloudinary.com/dgdimswvi/image/upload/v1742275046/profile_pictures/d8q6xwmcfillzuprhgod.png",
	// 		role: "Full Stack Developer",
	// 		workTime: "Full-Time",
	// 		workMode: "Hybrid",
	// 		jobLocation: "Calicut, Kinfra",
	// 		minSalary: 3,
	// 		maxSalary: 5,
	// 		minimumExperience: 1,
	// 		lastDate: new Date("2025-04-30T07:51:17.602+00:00"),
	// 		createdAt: new Date("2025-04-25T07:51:17.602+00:00"),
	// 	},
	// 	{
	// 		userId: "1234567893",
	// 		companyName: "Apple",
	// 		profilePicture:
	// 			"https://res.cloudinary.com/dgdimswvi/image/upload/v1742275046/profile_pictures/d8q6xwmcfillzuprhgod.png",
	// 		role: "Full Stack Developer",
	// 		workTime: "Full-Time",
	// 		workMode: "Hybrid",
	// 		jobLocation: "Calicut, Kinfra",
	// 		minSalary: 3,
	// 		maxSalary: 5,
	// 		minimumExperience: 1,
	// 		lastDate: new Date("2025-04-30T07:51:17.602+00:00"),
	// 		createdAt: new Date("2025-04-25T07:51:17.602+00:00"),
	// 	},
	// 	{
	// 		userId: "1234567894",
	// 		companyName: "Apple",
	// 		profilePicture:
	// 			"https://res.cloudinary.com/dgdimswvi/image/upload/v1742275046/profile_pictures/d8q6xwmcfillzuprhgod.png",
	// 		role: "Full Stack Developer",
	// 		workTime: "Full-Time",
	// 		workMode: "Hybrid",
	// 		jobLocation: "Calicut, Kinfra",
	// 		minSalary: 3,
	// 		maxSalary: 5,
	// 		minimumExperience: 1,
	// 		lastDate: new Date("2025-04-30T07:51:17.602+00:00"),
	// 		createdAt: new Date("2025-04-25T07:51:17.602+00:00"),
	// 	},
	// ];

	useEffect(() => {
		(async () => {
			setLoading({ ...loading, jobs: true });
			const response = await getJobs(
				filteredUrl(urlQuery.filter, urlQuery.page, urlQuery.sortOrder)
			);
			if (response.success) {
				setJobs(response.data.jobs);
				setLoading({ ...loading, jobs: false });
				setPageData({
					...pageData,
					totalPages: response.data.totalPages,
				});
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading({ ...loading, jobs: false });
			}
		})();
	}, [urlQuery]);

	useEffect(() => {
		setUrlQuery((prevUrlQuery) => ({
			...prevUrlQuery,
			sortOrder: sort === "Newest" ? "-1" : "1",
		}));
	}, [sort]);

	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[{ component: "Jobs", path: studentRoutes.JOBS }]}
			/>
			<section>
				<div className="md:px-20 px-5 md:my-10 my-4">
					<p className="font-mono font-bold text-lg md:text-3xl text-center">
						Find your perfect job, at the perfect place
					</p>
				</div>
			</section>

			<JobSearch {...jobSearchProps} />

			<div className="flex justify-center">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start p-4 md:p-8">
					{loading.jobs ? (
						[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)
					) : jobs.length ? (
						jobs.map((job: JobCardProps) => {
							return <JobCard key={job.userId} {...job} />;
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
			<DynamicPagination {...pageData} setPage={setPage} />
		</div>
	);
};

export default Jobs;
