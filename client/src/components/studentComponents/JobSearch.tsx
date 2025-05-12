import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { JobSearchProps } from "@/types/propsTypes";

const JobSearch: React.FC<JobSearchProps> = ({
	search,
	setSearch,
	sort,
	setSort,
}) => {
	return (
		<>
			<Input
				id="search"
				className="md:w-1/3  mb-3 md:mb-0"
				type="text"
				placeholder="Search for jobs..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				required
			/>
			<div className="flex gap-5">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Sort &nbsp; &#x25BC;</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-26">
						<DropdownMenuLabel className="text-center">
							Select Recruiter
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={sort}
							onValueChange={(value) =>
								setSort(value as "Newest" | "Oldest")
							}
						>
							<DropdownMenuRadioItem value="Newest">
								Newest
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="Oldest">
								Oldest
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};

export default JobSearch;
