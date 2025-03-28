import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
	accepted: {
		label: "Accepted",
		color: "#106a2e",
	},
	rejected: {
		label: "Rejected",
		color: "#e21d48",
	},
} satisfies ChartConfig;

export function AcceptanceRadial(props: {accepted: number, rejected: number}) {
	const acceptance = (props.accepted / (props.accepted + props.rejected) * 100).toFixed(2)
	const chartData = [{accepted: props.accepted, rejected: props.rejected}]

	return (
		<Card className="flex flex-col bg-white dark:bg-zinc-900 !border-none">
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square w-full w-[250px]"
				>
					<RadialBarChart
						data={chartData}
						endAngle={180}
						innerRadius={80}
						outerRadius={130}
					>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
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
											>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) - 16}
													className="fill-foreground text-2xl font-bold"
												>
													{acceptance.toLocaleString()}%
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 4}
													className="fill-muted-foreground"
												>
													{props.accepted + props.rejected} attempts
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>
						<RadialBar
							dataKey="accepted"
							stackId="a"
							cornerRadius={5}
							fill="var(--color-accepted)"
							className="stroke-transparent stroke-2"
						/>
						<RadialBar
							dataKey="rejected"
							fill="var(--color-rejected)"
							stackId="a"
							cornerRadius={5}
							className="stroke-transparent stroke-2"
						/>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					Acceptance
				</div>
			</CardFooter>
		</Card>
	);
}
