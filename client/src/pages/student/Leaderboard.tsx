import { LeaderboardEntry } from "@/types/types";
import leaderboardImage from "@/assets/leaderboard2.png";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicPagination } from "@/components/Pagination";
import { useNavigate } from "react-router-dom";
import { studentRoutes } from "@/constants/routeUrl";

const Leaderboard = () => {
	const [leaderboardData, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [pageData, setPageData] = useState({ page: 1, totalPages: 1 });

	const setPage = (page: number) => {
		setPageData((prev) => ({ ...prev, page }));
	};

	const { toast } = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await getLeaderboard(pageData.page);

			if (response.success) {
				setLeaderboard(response.data.leaderboard);
				if (response.data.rank) {
					setCurrentUser(response.data.rank);
					setPageData((prev) => ({
						...prev,
						totalPages: response.data.totalPages,
					}));
				}
				setLoading(false);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageData.page]);
	return (
		<div className="min-h-screen pt-24">
			<div className="max-w-5xl mx-auto p-4">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
					<div className="flex items-center mb-4 md:mb-0">
						<div className="mr-4">
							<img
								src={leaderboardImage}
								alt="image"
								className="max-w-[100px]"
							/>
						</div>
						<h1 className="text-3xl font-bold">Leaderboard</h1>
					</div>

					<div className=" p-4 rounded-lg">
						<h2 className="text-xl font-bold mb-2">
							How to lead in the Leaderboard?
						</h2>
						<p className="mb-2 text-sm">
							Solve as much problems as you can. Each difficulty
							level have specific points earn as much points as
							you can to lead in the leaderboard.
						</p>
						<div className="flex space-x-4 mt-2">
							<div>
								<span className="text-green-400 font-medium">
									Beginner
								</span>
								<span className="ml-2 ">1 Point</span>
							</div>
							<div>
								<span className="text-yellow-400 font-medium">
									Intermediate
								</span>
								<span className="ml-2 ">2 Points</span>
							</div>
							<div>
								<span className="text-red-500 font-medium">
									Advanced
								</span>
								<span className="ml-2 ">4 Points</span>
							</div>
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<div className="min-w-[900px]">
						{!loading && currentUser && (
							<div className="mb-4 dark:bg-slate-800 bg-slate-200 border border-blue-500 rounded-lg">
								<div className="grid grid-cols-5 text-center p-3">
									<div className="text-blue-400 font-medium">
										{currentUser.rank}
									</div>
									<div className="text-left pl-4">
										{currentUser.username}
									</div>
									<div>
										{currentUser.solved.beginner +
											currentUser.solved.intermediate *
												2 +
											currentUser.solved.advanced * 4}
									</div>
									<div className="grid grid-cols-3">
										<div>{currentUser.solved.beginner}</div>
										<div>
											{currentUser.solved.intermediate}
										</div>
										<div>{currentUser.solved.advanced}</div>
									</div>
								</div>
							</div>
						)}

						<div className="rounded-lg">
							<div className="grid grid-cols-6 text-center p-3 ">
								<div className="text-gray-400 pl-4">Rank</div>
								<div className="text-gray-400 text-left">
									Name
								</div>
								<div className="text-gray-400">
									Total Points
								</div>
								<div className="text-gray-400">Beginner</div>
								<div className="text-gray-400">
									Intermediate
								</div>
								<div className="text-gray-400">Advanced</div>
							</div>
							{!loading
								? leaderboardData.map((entry) => (
										<div
											key={entry.rank}
											className={`grid grid-cols-6 text-center p-3 border-t border-gray-800 ${
												entry.rank <= 3
													? " border border-yellow-500"
													: ""
											}`}
										>
											<div
												className={`${
													entry.rank <= 3
														? "text-yellow-500"
														: ""
												} font-medium`}
											>
												{entry.rank}
											</div>
											<div
												className="text-left pl-4 cursor-pointer hover:underline"
												onClick={() =>
													navigate(
														studentRoutes.STRANGER_PROFILE,
														{
															state: {
																userId: entry.userId,
															},
														}
													)
												}
											>
												{entry.username}
											</div>
											<div>
												{entry.solved.beginner +
													entry.solved.intermediate *
														2 +
													entry.solved.advanced * 4}
											</div>
											<div>{entry.solved.beginner}</div>
											<div>
												{entry.solved.intermediate}
											</div>
											<div>{entry.solved.advanced}</div>
										</div>
								  ))
								: [...Array(5)].map((_, index) => (
										<Skeleton
											className="flex min-w-[900px] h-12 mb-1"
											key={index}
										/>
								  ))}
						</div>
					</div>
				</div>
				<div className="mt-5">
					{pageData.page > 1 ? (
						<DynamicPagination {...pageData} setPage={setPage} />
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
