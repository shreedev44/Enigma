import { LabelList, RadialBar, RadialBarChart } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const chartConfig = {
	solved: {
		label: "solved",
	},
	Beginner: {
		label: "Beginner",
	},
	Intermediate: {
		label: "Intermediate",
	},
	Advanced: {
		label: "Advanced",
	},
} satisfies ChartConfig;

export default function DifficultyRadial(props: {
	Beginner: number;
	Intermediate: number;
	Advanced: number;
}) {
  const chartData = [
    { difficulty: "Advanced", solved: props.Advanced, fill: "#ef4444" },
    { difficulty: "Intermediate", solved: props.Intermediate, fill: "#eab308" },
    { difficulty: "Beginner", solved: props.Beginner, fill: "#22c55e" },
  ];
	return (
		<Card className="flex flex-col bg-white dark:bg-zinc-900 !border-none">
			<CardContent className="flex-1 pb-0 mb-5">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<RadialBarChart
						data={chartData}
						startAngle={-90}
						endAngle={380}
						innerRadius={30}
						outerRadius={110}
					>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									hideLabel
									nameKey="difficulty"
								/>
							}
						/>
						<RadialBar dataKey="solved" background>
							<LabelList
								position="insideStart"
								dataKey="difficulty"
								className="fill-white capitalize mix-blend-luminosity"
								fontSize={11}
							/>
						</RadialBar>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					Problems solved in each difficulty
				</div>
			</CardFooter>
		</Card>
	);
}
