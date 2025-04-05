import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const chartConfig = {
	solved: {
		label: "Solved",
	},
	problems: {
		label: "Problems",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export default function ProblemRadial(props: {
	solved: number;
	exist: number;
}) {
	const chartData = [{ solved: props.solved, fill: "#098637" }];
	return (
		<Card className="flex flex-col bg-white dark:bg-zinc-900 !border-none">
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square h-[250px]"
				>
					<RadialBarChart
						data={chartData}
						startAngle={0}
						endAngle={props.exist === 0 ? 0 : (props.solved / props.exist) * 360}
						innerRadius={80}
						outerRadius={110}
					>
						<PolarGrid
							gridType="circle"
							radialLines={false}
							stroke="none"
							className="first:fill-muted last:fill-background"
							polarRadius={[86, 74]}
						/>
						<RadialBar
							dataKey="solved"
							background
							cornerRadius={10}
						/>
						<PolarRadiusAxis
							tick={false}
							tickLine={false}
							axisLine={false}
						>
							<Label
								content={({ viewBox }) => {
									if (
										viewBox &&
										"cx" in viewBox &&
										"cy" in viewBox
									) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-4xl font-bold"
												>
													{chartData[0].solved.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Solved of {props.exist} Problems
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					Total problems solved
				</div>
			</CardFooter>
		</Card>
	);
}
