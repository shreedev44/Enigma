/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { ApplicationShort } from "@/types/types";
import {
	getApplications,
	getShortlist,
	shortlistApplications,
} from "@/api/recruiter";
import { useToast } from "@/hooks/use-toast";
import { DynamicPagination } from "@/components/Pagination";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { fetchSkills } from "@/api/common";
import _ from "lodash";

const Applications = () => {
	const location = useLocation();
	const { state } = location || {};

	const navigate = useNavigate();

	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [applications, setApplications] = useState<ApplicationShort[]>([]);
	const [pageData, setPageData] = useState({ page: 1, totalPages: 1 });
	const [loading, setLoading] = useState(false);
	const [totalApplications, setTotalApplications] = useState(0);
	const [trigger, setTrigger] = useState(true);
	const [shortlistView, setShortlistView] = useState(false);
	const [open, setOpen] = useState(false);
	const [suggestionLoading, setSuggestionLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const { toast } = useToast();

	const setPage = (page: number) => {
		if (page < 1) return;
		setPageData((prev) => ({ ...prev, page }));
	};

	useEffect(() => {
		if (!state) {
			navigate(-1);
		}
	}, []);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await getApplications(`page=${pageData.page}`, {
				tags,
				jobId: state.jobId,
			});

			if (response.success) {
				setApplications(response.data.applications);
				setPageData((prev) => ({
					...prev,
					totalPages: response.data.totalPages,
				}));
				setTotalApplications(response.data.totalApplications);
				setLoading(false);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading(false);
			}
		})();
	}, [pageData.page, trigger]);

	const handleAddTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			setTags([...tags, tagInput.trim()]);
			setTagInput("");
		}
	};

	const viewShortlist = async () => {
		if (!shortlistView) {
			setShortlistView(true);
			setLoading(true);
			const response = await getShortlist(state.jobId);
			if (response.success) {
				setApplications(response.data.applications);
				setPageData((prev) => ({
					...prev,
					totalPages: response.data.totalPages,
				}));
				setTotalApplications(response.data.totalApplications);
				setLoading(false);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading(false);
				setShortlistView(false);
				setTrigger((prev) => !prev);
			}
		} else {
			setShortlistView(false);
			setTrigger((prev) => !prev);
		}
	};

	const handleRemoveTag = (index: number) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	const handleShortlist = async () => {
		setLoading(true);
		const response = await shortlistApplications(state.jobId, { tags });

		if (response.success) {
			toast({
				description: response.data.message,
			});
			setLoading(false);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	const fetchSkillKeywords = async (query: string) => {
		setSuggestionLoading(true);
		try {
			return await fetchSkills(query);
		} catch (error) {
			console.error("Error fetching skill suggestions:", error);
			return [];
		} finally {
			setSuggestionLoading(false);
		}
	};

	const debouncedFetchSuggestions = useCallback(
		_.debounce(async (query: string) => {
			if (query.trim().length > 0) {
				const results = await fetchSkillKeywords(query);
				setSuggestions(results);
				setOpen(true);
			} else {
				setSuggestions([]);
				setOpen(false);
			}
		}, 300),
		[]
	);

	const handleSelectTag = (selectedTag: string) => {
		if (!tags.includes(selectedTag)) {
			setTags([...tags, selectedTag]);
			setTagInput("");
			setOpen(false);
		}
	};

	useEffect(() => {
		debouncedFetchSuggestions(tagInput);
		return () => {
			debouncedFetchSuggestions.cancel();
		};
	}, [tagInput, debouncedFetchSuggestions]);

	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[
					{
						component: "My jobs",
						path: `/recruiter${recruiterRoutes.JOBS}`,
					},
					{ component: state?.role || "Job Role", path: -1 },
					{ component: "Applications" },
				]}
			/>
			<div className="min-h-screen px-3 md:px-6 py-10">
				<h1 className="text-2xl md:text-3xl font-bold mb-6">
					{totalApplications} {shortlistView ? "shortlisted" : ""}{" "}
					Application {totalApplications > 1 ? "s" : ""}
				</h1>

				<div className="flex flex-col md:flex-row justify-between gap-4">
					{!shortlistView && (
						<div className="space-y-4 w-full md:max-w-md">
							<div className="flex gap-2">
								<Popover open={open}>
									<PopoverTrigger asChild>
										<div className="relative flex-1">
											<Input
												placeholder="Add a tag..."
												className="border"
												value={tagInput}
												onChange={(e) =>
													setTagInput(e.target.value)
												}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleAddTag();
														e.preventDefault();
													}
												}}
												onFocus={() => {
													if (tagInput.trim())
														setOpen(true);
												}}
											/>
										</div>
									</PopoverTrigger>
									<PopoverContent
										className="p-0 flex"
										align="start"
										sideOffset={4}
										avoidCollisions={false}
									>
										<Command shouldFilter={false}>
											<CommandList>
												{suggestionLoading ? (
													<div className="flex items-center justify-center p-4 text-sm">
														Loading suggestions...
													</div>
												) : suggestions.length > 0 ? (
													<CommandGroup>
														{suggestions.map(
															(suggestion) => (
																<CommandItem
																	key={
																		suggestion
																	}
																	onSelect={() =>
																		handleSelectTag(
																			suggestion
																		)
																	}
																	onMouseDown={(
																		e
																	) =>
																		e.preventDefault()
																	}
																>
																	{suggestion}
																</CommandItem>
															)
														)}
													</CommandGroup>
												) : (
													<CommandEmpty>
														No skills found.
													</CommandEmpty>
												)}
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<Button
									type="button"
									onClick={handleAddTag}
									className="bg-fleace font-bold font-mono"
								>
									Add
								</Button>

								<Button
									className="bg-fleace font-bold font-mono"
									disabled={loading}
									onClick={() => setTrigger((prev) => !prev)}
								>
									Search
								</Button>
							</div>

							<ScrollArea className="h-32 rounded-md p-2 border border-black dark:border-white">
								<ul className="flex flex-wrap gap-2">
									{tags.map((tag, index) => (
										<li
											key={index}
											className="flex items-center border border-black dark:border-white text-black dark:text-white px-3 py-1 rounded-md"
										>
											<span>{tag}</span>
											<Button
												variant="ghost"
												size="sm"
												className="ml-2 text-black dark:text-white"
												onClick={() =>
													handleRemoveTag(index)
												}
											>
												<X className="w-4 h-4" />
											</Button>
										</li>
									))}
								</ul>
							</ScrollArea>
						</div>
					)}
					<Button
						className="bg-mildgreen mt-4 md:mt-0 font-bold font-mono w-full md:w-auto"
						disabled={loading}
						onClick={viewShortlist}
					>
						{shortlistView
							? "View Non-shortlisted Applications"
							: "View Shortlist"}
					</Button>
				</div>

				<div className="overflow-x-auto my-8">
					<div className="grid grid-cols-5 font-semibold text-sm border-y border-black dark:border-[#f7e9c8] py-2 min-w-[600px]">
						<span>Name</span>
						<span>Experience (yrs)</span>
						<span>Contact No</span>
						<span>Email</span>
					</div>

					<div className="space-y-2 mt-4 min-w-[600px]">
						{applications.map((value, index) => (
							<div
								key={index}
								className="grid grid-cols-5 border border-black dark:border-[#f7e9c8] rounded-md px-4 py-2 text-sm cursor-pointer"
								onClick={() =>
									navigate(
										`/recruiter${recruiterRoutes.APPLICATION_DETILAILS}`,
										{
											state: {
												role: state?.role,
												jobId: state?.jobId,
												applicationId: value._id,
												name: value.name,
												shortlisted: shortlistView,
											},
										}
									)
								}
							>
								<span className="font-semibold">
									{value.name}
								</span>
								<span>{value.yearOfExperience}</span>
								<span className="font-semibold">
									{value.phone}
								</span>
								<span className="font-semibold">
									{value.email}
								</span>
							</div>
						))}
					</div>
					{!shortlistView && applications.length > 0 && (
						<Button
							className="mt-3 bg-bluegrey font-bold font-mono"
							onClick={handleShortlist}
						>
							Shortlist These Applications
						</Button>
					)}
				</div>
				{applications.length > 0 && (
					<DynamicPagination {...pageData} setPage={setPage} />
				)}
				{applications.length === 0 ? " No applications yet..." : <></>}
			</div>
		</div>
	);
};

export default Applications;
