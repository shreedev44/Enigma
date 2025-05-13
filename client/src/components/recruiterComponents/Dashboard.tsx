import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import {
	getApplicationsPerDate,
	getTotalInterviews,
	getTotalJobs,
} from "@/api/recruiter";
import { generateDailyCounts } from "@/utils/generateDateArray";

const chartConfig = {
	views: {
		label: "Applications",
	},
	count: {
		label: "Count",
		color: "hsl(var(--chart-1))",
	},
};

export function Dashboard() {
	const activeChart = "count";

	const { toast } = useToast();
	const [applicationData, setApplicationData] = useState<
		{ date: string; count: number }[]
	>([]);
	const [jobs, setJobs] = useState(0);
	const [interviews, setInterviews] = useState(0);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [jobResponse, interviewResponse, applicationResponse] =
					await Promise.all([
						getTotalJobs(),
						getTotalInterviews(),
						getApplicationsPerDate(),
					]);

				if (
					jobResponse.success &&
					interviewResponse.success &&
					applicationResponse
				) {
					setJobs(jobResponse.data.result);
					setInterviews(interviewResponse.data.result);
					setApplicationData(
						generateDailyCounts(applicationResponse.data.result)
					);
				}
			} catch (err) {
				toast({
					description: "An error occurred while fetching stats.",
					variant: "destructive",
				});
				console.log(err);
			}
		};
		fetchStats();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="space-y-8 md:mx-20 mt-10">
			<Card>
				<CardHeader>
					<CardTitle>Job Overview</CardTitle>
					<CardDescription>
						Key metrics related to job postings and interviews.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<div className="mb-4">
							<span className="text-sm font-medium">
								Jobs Posted
							</span>
							<div className="text-2xl font-bold">{jobs}</div>
						</div>
						<div>
							<span className="text-sm font-medium">
								Interviews Conducted
							</span>
							<div className="text-2xl font-bold">
								{interviews}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
						<CardTitle>Applications per day</CardTitle>
						<CardDescription>
							Showing total applications for the last year
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="px-2 sm:p-6">
					<ChartContainer
						config={chartConfig}
						className="aspect-auto h-[250px] w-full"
					>
						<BarChart
							accessibilityLayer
							data={applicationData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									});
								}}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className="w-[150px]"
										nameKey="views"
										labelFormatter={(value) => {
											return new Date(
												value
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											});
										}}
									/>
								}
							/>
							<Bar
								dataKey={activeChart}
								fill={`var(--color-${activeChart})`}
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
