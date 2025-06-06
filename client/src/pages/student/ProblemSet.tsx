/* eslint-disable react-hooks/exhaustive-deps */
import { getProblems, leaderboardTopThree } from "@/api/student";
import Breadcrumbs from "@/components/Breadcrumbs";
import { studentRoutes } from "@/constants/routeUrl";
import { ProblemListType } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProblemsTable from "@/components/ProblemTable";
import debounce from "debounce";
import leaderboardImage from "@/assets/leaderboard.png";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProblemSet = () => {
	const { toast } = useToast();
	const navigate = useNavigate();

	const [problems, setProblems] = useState<ProblemListType[]>([]);
	const [filteredProblems, setFilteredProblems] = useState<ProblemListType[]>(
		[]
	);
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	const [urlQuery, setUrlQuery] = useState({
		page: "1",
		sortBy: "problemNo",
		sortOrder: "1",
		filter: "",
	});
	const [leaderboard, setLeaderboard] = useState<
		{ username: string; rank: number; userId: string }[]
	>([]);
	const [leaderboardLoading, setLeaderboardLoading] = useState(false);

	const filteredUrl = (
		filter = "",
		page = "1",
		sortBy = "problemNo",
		sortOrder = "1"
	) => {
		if (urlQuery.page !== page) setUrlQuery({ ...urlQuery, page });
		if (urlQuery.sortBy !== sortBy) setUrlQuery({ ...urlQuery, sortBy });
		if (urlQuery.sortOrder !== sortOrder)
			setUrlQuery({ ...urlQuery, sortOrder });
		if (urlQuery.filter !== filter) setUrlQuery({ ...urlQuery, filter });

		return new URLSearchParams({
			page,
			sortBy,
			sortOrder,
			filter,
		}).toString();
	};

	const debouncedSetQuery = useCallback(
		debounce((val) => setQuery(val), 1500),
		[]
	);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await getProblems();

			if (response.success) {
				setProblems(response.data.problems);
				setFilteredProblems(response.data.problems);
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
	}, []);

	useEffect(() => {
		(async () => {
			setLeaderboardLoading(true);
			const response = await leaderboardTopThree();

			if (response.success) {
				setLeaderboard(response.data.leaderboard);
				setLeaderboardLoading(false);
			} else {
				setLeaderboardLoading(false);
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
	}, []);

	useEffect(() => {
		debouncedSetQuery(search);
	}, [search]);

	useEffect(() => {
		setLoading(true);
		const filteredProbs = problems.filter((problem) => {
			return (
				problem.title.toLowerCase().startsWith(search.toLowerCase()) ||
				String(problem.problemNo).startsWith(search)
			);
		});
		if (filteredProbs.length) {
			setFilteredProblems(filteredProbs);
			setLoading(false);
		} else {
			(async () => {
				const response = await getProblems(
					filteredUrl(
						search,
						urlQuery.page,
						urlQuery.sortBy,
						urlQuery.sortOrder
					)
				);

				if (response.success) {
					setFilteredProblems(response.data.problems);
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
		}
	}, [query]);

	const sort = async (sortBy: string) => {
		let sortOrder = urlQuery.sortOrder;
		if (urlQuery.sortBy !== sortBy) {
			sortOrder = "1";
		} else {
			if (urlQuery.sortOrder === "1") {
				sortOrder = "-1";
			} else {
				sortOrder = "1";
			}
		}
		setLoading(true);
		const response = await getProblems(
			filteredUrl(urlQuery.filter, urlQuery.page, sortBy, sortOrder)
		);
		if (response.success) {
			setFilteredProblems(response.data.problems);
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
	};

	const setPage = useCallback(
		async (page: number) => {
			setLoading(true);

			const url = filteredUrl(
				urlQuery.filter,
				String(page),
				urlQuery.sortBy,
				urlQuery.sortOrder
			);

			const response = await getProblems(url);

			if (response.success) {
				setProblems(response.data.problems);

				setFilteredProblems(response.data.problems);
				setPageData((prev) => ({
					...prev,
					page,
					totalPages: response.data.totalPages,
				}));
			} else {
				toast({ description: response.error, variant: "destructive" });
			}

			setLoading(false);
		},
		[urlQuery]
	);

	const [pageData, setPageData] = useState({
		page: 1,
		totalPages: 1,
		setPage,
	});
	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[
					{ component: "Home", path: studentRoutes.HOME },
					{ component: "Problems" },
				]}
			/>
			<div className="md:flex justify-around px-5 gap-10">
				<ProblemsTable
					data={filteredProblems}
					userLevel="student"
					loading={loading}
					search={search}
					setSearch={setSearch}
					sort={sort}
					pageData={pageData}
				/>
				{leaderboardLoading ? (
					<Skeleton className="md:w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded-lg px-5 h-72" />
				) : (
					<div className="md:w-1/3 bg-zinc-200 dark:bg-zinc-900 rounded-lg px-5 flex flex-col justify-between py-5 h-[350px]">
						<div>
							<div className="flex justify-center">
								<img
									src={leaderboardImage}
									alt="image"
									className="max-w-16"
								/>
							</div>
							<h1 className="text-lg font-mono font-bold m-3 text-center">
								Leaderboard Top 3
							</h1>
							<div className="mt-5">
								{leaderboard &&
									leaderboard.map((value) => (
										<p
											key={value.userId}
											className="text-xl md:text-2xl my-2 font-mono font-bold"
										>
											{value.rank} {value.username}
										</p>
									))}
							</div>
						</div>
						<div className="flex justify-center">
							<Button
								className="bg-fleace rounded-full font-bold font-mono"
								onClick={() =>
									navigate(studentRoutes.LEADERBOARD)
								}
							>
								View Leaderboard
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProblemSet;
