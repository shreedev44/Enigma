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
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "../ui/skeleton";

const JobSearch: React.FC<JobSearchProps> = ({
	search,
	setSearch,
	sort,
	setSort,
	popoverOpen,
	setPopoverOpen,
	recruiterSearch,
	setRecruiterSearch,
	recruiters,
	loading,
}) => {
	return (
		<div>
			<div className="md:flex justify-center gap-5 mx-4 md:mx-0">
				<Input
					id="search"
					className="md:w-1/3  mb-3 md:mb-0"
					type="text"
					placeholder="Search for job titles..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					required
				/>
				<div className="flex gap-5">
					<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={popoverOpen}
								className="w-[200px] justify-between"
							>
								{recruiterSearch
									? recruiters.find(
											(recruiter) =>
												recruiter === recruiterSearch
									  )
									: "Select recruiter..."}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search framework..." />
								<CommandList>
									<CommandEmpty>
										{loading ? "No recruiters found." : ""}
									</CommandEmpty>
									<CommandGroup>
										{loading &&
											[...Array(5)].map((_, i) => {
												return (
													<CommandItem
														key={i}
														value="loading"
														disabled
													>
														<Skeleton className="w-full h-7" />
													</CommandItem>
												);
											})}
										{!loading &&
											recruiters.map((recruiter) => (
												<CommandItem
													key={recruiter}
													value={recruiter}
													onSelect={(
														currentValue
													) => {
														setRecruiterSearch(
															currentValue ===
																recruiterSearch
																? ""
																: currentValue
														);
														setPopoverOpen(false);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															recruiterSearch ===
																recruiter
																? "opacity-100"
																: "opacity-0"
														)}
													/>
													{recruiter}
												</CommandItem>
											))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Sort &nbsp; &#x25BC;
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-26">
							<DropdownMenuLabel className="text-center">
								Select Recruiter
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuRadioGroup
								value={sort}
								onValueChange={(value) => setSort(value as "Newest" | "Oldest")}
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
			</div>
		</div>
	);
};

export default JobSearch;
