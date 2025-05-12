import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Filters } from "@/types/types";

const defaultFilter = {
	expectedSalary: 0,
	workMode: "",
	workTime: "",
	minimumExperience: 0,
};

const FilterButton = ({
	handleFilterApply,
	urlQuery,
}: {
	handleFilterApply: (filters: Record<string, string>) => void;
	urlQuery: {
		page: string;
		sortOrder: string;
		filter: string;
		userId: string;
		expectedSalary: string;
		workMode: string;
		workTime: string;
		minimumExperience: string;
	};
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [filters, setFilters] = useState<Filters>({
		expectedSalary: 0,
		workMode: "",
		workTime: "",
		minimumExperience: 0,
	});

	const handleInputChange = (field: keyof Filters, value: string) => {
		const numValue = parseInt(value, 10);
		setFilters((prev) => ({
			...prev,
			[field]: isNaN(numValue) ? 0 : numValue,
		}));
	};

	const handleSelectChange = (field: keyof Filters, value: string) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const applyFilters = () => {
		const obj: Record<string, string> = {};

		if (String(filters.expectedSalary) !== urlQuery.expectedSalary) {
			obj.expectedSalary = String(filters.expectedSalary);
		}
		if (filters.workMode !== urlQuery.workMode) {
			obj.workMode = filters.workMode;
		}
		if (filters.workTime !== urlQuery.workTime) {
			obj.workTime = filters.workTime;
		}
		if (String(filters.minimumExperience) !== urlQuery.minimumExperience) {
			obj.minimumExperience = String(filters.minimumExperience);
		}

		handleFilterApply(obj);
		setIsOpen(false);
	};

	const resetFilters = () => {
		setFilters(defaultFilter);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="relative">
					<Filter className="w-4 h-4 mr-2" />
					Filters
					{Object.values(filters).some((value) => value) && (
						<div className="absolute top-0 right-0 -mt-0.5 -mr-0.5 w-2 h-2 rounded-full bg-red-500" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-80 p-4 space-y-4"
				align="end"
				alignOffset={-10}
			>
				<h3 className="text-lg font-semibold">Filter Options</h3>

				<div>
					<label className="block text-sm font-medium">
						Expected Salary (LPA)
					</label>
					<Input
						type="number"
						placeholder="e.g., 10"
						value={filters.expectedSalary}
						onChange={(e) =>
							handleInputChange("expectedSalary", e.target.value)
						}
						className="w-full mt-1"
						min={0}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">
						Work Mode
					</label>
					<Select
						onValueChange={(value) =>
							handleSelectChange("workMode", value)
						}
						value={filters.workMode}
					>
						<SelectTrigger className="w-full mt-1">
							<SelectValue placeholder="Select work mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Remote">Remote</SelectItem>
							<SelectItem value="Hybrid">Hybrid</SelectItem>
							<SelectItem value="On-Site">On-Site</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<label className="block text-sm font-medium">
						Work Time
					</label>
					<Select
						onValueChange={(value) =>
							handleSelectChange("workTime", value)
						}
						value={filters.workTime}
					>
						<SelectTrigger className="w-full mt-1">
							<SelectValue placeholder="Select work time" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Full-Time">Full-Time</SelectItem>
							<SelectItem value="Part-Time">Part-Time</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<label className="block text-sm font-medium">
						Minimum Experience (Years)
					</label>
					<Input
						type="number"
						placeholder="e.g., 0"
						value={filters.minimumExperience}
						onChange={(e) =>
							handleInputChange(
								"minimumExperience",
								e.target.value
							)
						}
						className="w-full mt-1"
						min={0}
					/>
				</div>

				<div className="flex justify-end gap-2">
					<Button variant="outline" size="sm" onClick={resetFilters}>
						Reset
					</Button>
					<Button size="sm" onClick={applyFilters}>
						Apply
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default FilterButton;
