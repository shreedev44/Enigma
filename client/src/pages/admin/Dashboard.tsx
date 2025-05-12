import { useSidebarContext } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import {
	getUserStats,
	getApplicationStats,
	getProblemStats,
	getJobStats,
} from "@/api/admin";
import { useToast } from "@/hooks/use-toast";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import LineChartComponent from "@/components/charts/LineChart";
import { generateDailyCounts } from "@/utils/generateDateArray";

const Dashboard = () => {
	const { setBreadcrumbs } = useSidebarContext();
	const { toast } = useToast();

	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalStudents: 0,
		totalRecruiters: 0,
		totalJobs: 0,
		applicationsPerJob: 0,
		totalAttempts: 0,
		attemptsPerDay: 0,
		acceptanceRate: 0,
	});
	const [jobData, setJobData] = useState<{ date: string; count: number }[]>(
		[]
	);
	const [attemptData, setAttemptData] = useState<
		{ date: string; count: number }[]
	>([]);

	useEffect(() => {
		setBreadcrumbs([{ component: "Dashboard" }]);
	}, [setBreadcrumbs]);

	useEffect(() => {
		const fetchStats = async () => {
			setLoading(true);

			try {
				const [
					userStatsResponse,
					applicationStatsReponse,
					problemStatsResponse,
					jobStatsResponse,
				] = await Promise.all([
					getUserStats(),
					getApplicationStats(),
					getProblemStats(),
					getJobStats(),
				]);

				if (
					userStatsResponse.success &&
					applicationStatsReponse.success &&
					problemStatsResponse.success &&
					jobStatsResponse.success
				) {
					setStats({
						totalStudents: userStatsResponse.data.totalStudents,
						totalRecruiters: userStatsResponse.data.totalRecruiters,
						totalJobs: jobStatsResponse.data.result.length,
						applicationsPerJob:
							applicationStatsReponse.data.applicationsPerJob,
						totalAttempts: problemStatsResponse.data.totalAttempts,
						attemptsPerDay:
							problemStatsResponse.data.attemptsPerDay,
						acceptanceRate:
							problemStatsResponse.data.acceptanceRate,
					});
					setJobData(
						generateDailyCounts(jobStatsResponse.data.result)
					);
					setAttemptData(
						generateDailyCounts(
							problemStatsResponse.data.attemptsByDate
						)
					);
				} else {
					toast({
						description: "Failed to fetch some stats.",
						variant: "destructive",
					});
				}
			} catch (error) {
				toast({
					description: "An error occurred while fetching stats.",
					variant: "destructive",
				});
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [toast]);

	return (
		<div className="">
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<ClassicSpinner />
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-6 bg-blue-500 text-white rounded-lg shadow-md">
							<h2 className="text-lg font-bold">
								Total Students
							</h2>
							<p className="text-2xl font-mono">
								{stats.totalStudents}
							</p>
						</div>
						<div className="p-6 bg-green-500 text-white rounded-lg shadow-md">
							<h2 className="text-lg font-bold">
								Total Recruiters
							</h2>
							<p className="text-2xl font-mono">
								{stats.totalRecruiters}
							</p>
						</div>
						<div className="p-6 bg-purple-500 text-white rounded-lg shadow-md">
							<h2 className="text-lg font-bold">Total Jobs</h2>
							<p className="text-2xl font-mono">
								{stats.totalJobs}
							</p>
						</div>
						<div className="p-6 bg-yellow-500 text-white rounded-lg shadow-md">
							<h2 className="text-lg font-bold">
								Applications / Job
							</h2>
							<p className="text-2xl font-mono">
								{stats.applicationsPerJob}
							</p>
						</div>
						<div className="p-6 bg-red-500 text-white rounded-lg shadow-md">
							<h2 className="text-lg font-bold">
								Total Attempts
							</h2>
							<p className="text-2xl font-mono">
								{stats.totalAttempts}
							</p>
						</div>
						<div className="p-6 bg-indigo-500 text-white rounded-lg shadow-md">
							<h2 className="text-lg font-bold">
								Attempts / Day
							</h2>
							<p className="text-2xl font-mono">
								{stats.attemptsPerDay}
							</p>
						</div>
						<div className="p-6 bg-teal-500 text-white rounded-lg shadow-md">
							<h2 className="text-lg font-bold">
								Acceptance Rate
							</h2>
							<p className="text-2xl font-mono">
								{stats.acceptanceRate.toFixed(2)}%
							</p>
						</div>
					</div>

					<div className="mt-10">
						<h2 className="text-xl md:text-2xl font-bold mb-4">
							Jobs Per Day
						</h2>
						<LineChartComponent
							chartLabel="Number of jobs posted each day in the last year"
							data={jobData}
						/>
					</div>

					<div className="mt-10">
						<h2 className="text-xl md:text-2xl font-bold mb-4">
							Attempts Per Day
						</h2>
						<LineChartComponent
							chartLabel="Number of attempts each day in the last year"
							data={attemptData}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Dashboard;
