/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import HeatMap from "@uiw/react-heat-map";

const HeatMapChart = ({
	value,
}: {
	value: { date: string; count: number }[];
}) => {
	const [tooltip, setTooltip] = useState({
		show: false,
		x: 0,
		y: 0,
		content: "",
	});
	const containerRef = useRef<any>(null);

	const handleMouseEnter = (e: any, data: any) => {
		if (!containerRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();

		setTooltip({
			show: true,
			x: e.clientX - containerRect.left + window.scrollX,
			y: e.clientY - containerRect.top + window.scrollY,
			content: `${data.count} attempts on ${data.date}`,
		});
	};

	const handleMouseLeave = () => {
		setTooltip({ show: false, x: 0, y: 0, content: "" });
	};

	const startDate = new Date(
		value.length ? value[value.length - 1]?.date : Date.now()
	);
	startDate.setFullYear(startDate.getFullYear() - 1);

	const formatDate = (date: Date) => {
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yyyy}/${mm}/${dd}`;
	};

	return (
		<div
			ref={containerRef}
			style={{ position: "relative" }}
			className="flex"
		>
			<HeatMap
				className="w-full ml-3 dark:!text-zinc-50"
				value={value}
				width={600}
				rectSize={15}
				style={{ "--rhm-rect": "#3f3f3f" }}
				legendCellSize={0}
				startDate={new Date(formatDate(startDate))}
				endDate={new Date(Date.now())}
				monthLabels={[
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				]}
				weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
				monthPlacement="top"
				rectRender={(props, data) => {
					if (!data.count) return <rect {...props} />;
					return (
						<rect
							{...props}
							onMouseEnter={(e) => handleMouseEnter(e, data)}
							onMouseLeave={handleMouseLeave}
							style={{ cursor: "pointer" }}
						/>
					);
				}}
				rectProps={{
					rx: 3,
				}}
			/>
			{tooltip.show && (
				<div
					style={{
						position: "absolute",
						top: tooltip.y - 30,
						left: tooltip.x + 10,
						background: "rgba(0, 0, 0, 0.8)",
						color: "#fff",
						padding: "5px 8px",
						borderRadius: "4px",
						fontSize: "12px",
						pointerEvents: "none",
						whiteSpace: "nowrap",
						zIndex: 1000,
					}}
				>
					{tooltip.content}
				</div>
			)}
		</div>
	);
};

export default HeatMapChart;
