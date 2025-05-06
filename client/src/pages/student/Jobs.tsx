/* eslint-disable react-hooks/exhaustive-deps */
import { getJobs } from "@/api/student";
import Breadcrumbs from "@/components/Breadcrumbs";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/loaders/JobCardSkeleton";
import { DynamicPagination } from "@/components/Pagination";
import JobSearch from "@/components/studentComponents/JobSearch";

import { useToast } from "@/hooks/use-toast";
import { JobCardProps } from "@/types/propsTypes";
import debounce from "debounce";
import { useCallback, useEffect, useState } from "react";

const Jobs = () => {
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [sort, setSort] = useState<"Newest" | "Oldest">("Newest");
	const [loading, setLoading] = useState({ jobs: false, recruiters: false });
	const [urlQuery, setUrlQuery] = useState({
		page: "1",
		sortOrder: "-1",
		filter: "",
		userId: "",
	});
	const [jobs, setJobs] = useState<JobCardProps[]>([]);
	const [filtered, setFiltered] = useState<JobCardProps[]>([]);

	const { toast } = useToast();

	const filteredUrl = (
		filter = "",
		page = "1",
		sortOrder = "-1",
		userId = ""
	) => {
		if (urlQuery.page !== page) setUrlQuery({ ...urlQuery, page });
		if (urlQuery.sortOrder !== sortOrder)
			setUrlQuery({ ...urlQuery, sortOrder });
		if (urlQuery.filter !== filter) setUrlQuery({ ...urlQuery, filter });
		if (urlQuery.userId !== userId) setUrlQuery({ ...urlQuery, userId });

		return new URLSearchParams({
			page,
			sortOrder,
			filter,
			userId,
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

	const debouncedSetQuery = useCallback(
		debounce((val) => setQuery(val), 1500),
		[]
	);

	const jobSearchProps = {
		search,
		setSearch,
		sort,
		setSort,
		loading: loading.recruiters,
	};

	useEffect(() => {
		setUrlQuery((prevUrlQuery) => ({
			...prevUrlQuery,
			sortOrder: sort === "Newest" ? "-1" : "1",
			page: "1",
		}));
	}, [sort]);

	useEffect(() => {
		(async () => {
			setLoading((prevLoading) => ({ ...prevLoading, jobs: true }));
			const response = await getJobs(
				filteredUrl(urlQuery.filter, urlQuery.page, urlQuery.sortOrder)
			);
			if (response.success) {
				setJobs(response.data.jobs);
				setFiltered(response.data.jobs);
				setLoading((prevLoading) => ({ ...prevLoading, jobs: false }));
				setPageData({
					...pageData,
					totalPages: response.data.totalPages,
				});
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading((prevLoading) => ({ ...prevLoading, jobs: false }));
			}
		})();
	}, [urlQuery]);

	useEffect(() => {
		debouncedSetQuery(search);
	}, [search]);

	useEffect(() => {
		const filteredJobs = jobs.filter((job) => {
			return (
				job.role.toLowerCase().includes(query.toLowerCase()) ||
				job.companyName.toLowerCase().includes(query.toLowerCase()) ||
				job.workTime
					.toLowerCase()
					.includes(query.toLocaleLowerCase()) ||
				job.workMode
					.toLowerCase()
					.includes(query.toLocaleLowerCase()) ||
				job.jobLocation
					.toLowerCase()
					.includes(query.toLocaleLowerCase())
			);
		});
		if (filteredJobs.length) {
			setFiltered(filteredJobs);
		} else {
			setUrlQuery({ ...urlQuery, filter: query });
		}
	}, [query]);

	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[{ component: "Jobs" }]}
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
					) : filtered.length ? (
						filtered.map((job: JobCardProps) => {
							return <JobCard key={job._id} {...job} />;
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
			{filtered.length && !loading.jobs ? (
				<DynamicPagination {...pageData} setPage={setPage} />
			) : (
				<></>
			)}
		</div>
	);
};

export default Jobs;
