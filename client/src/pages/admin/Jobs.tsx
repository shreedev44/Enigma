/* eslint-disable react-hooks/exhaustive-deps */
import { useSidebarContext } from "@/context/SidebarContext";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/loaders/JobCardSkeleton";
import { DynamicPagination } from "@/components/Pagination";
import { useToast } from "@/hooks/use-toast";
import { JobCardProps } from "@/types/propsTypes";
import { useEffect, useState, useCallback } from "react";
import { getAllJobs } from "@/api/admin";
import debounce from "debounce";
import { adminRoutes } from "@/constants/routeUrl";

const Jobs = () => {
    const [jobs, setJobs] = useState<JobCardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageData, setPageData] = useState({ page: 1, totalPages: 1 });
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    const { setBreadcrumbs } = useSidebarContext();
    const { toast } = useToast();

    const setPage = (page: number) => {
        setPageData((prev) => ({ ...prev, page }));
    };

    const debouncedSetQuery = useCallback(
        debounce((val) => setQuery(val), 500),
        []
    );

    useEffect(() => {
        setBreadcrumbs([{ component: "Jobs" }]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        debouncedSetQuery(search);
    }, [search, debouncedSetQuery]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await getAllJobs(`page=${pageData.page}&filter=${query}`);

            if (response.success) {
                setJobs(response.data.jobs);
                setPageData((prev) => ({
                    ...prev,
                    totalPages: response.data.totalPages,
                }));
                setLoading(false);
            } else {
                toast({
                    description: response.error,
                    variant: "destructive",
                });
                setLoading(false);
            }
        })();
    }, [pageData.page, query]);

    return (
        <div>
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start p-4 md:p-8">
                    {loading ? (
                        [...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)
                    ) : jobs.length ? (
                        jobs.map((job: JobCardProps) => {
                            return <JobCard key={job._id} {...job} url={`/admin${adminRoutes.JOB_DETAILS}`} />;
                        })
                    ) : (
                        <div className="col-span-full flex justify-center">
                            <p className="text-xl font-mono font-bold text-center">
                                No jobs found...
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

export default Jobs;
