/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { X } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "../ui/command";
import _ from "lodash";
import { fetchSkills } from "@/api/common";

const SkillsModal = ({
	skills,
	setSkills,
	handleUpdateSkills,
}: {
	skills: string[];
	setSkills: (value: string[]) => void;
	handleUpdateSkills: () => void;
}) => {
	const [skillInput, setSkillInput] = useState("");
	const [open, setOpen] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const fetchSkillKeywords = async (query: string) => {
		setIsLoading(true);
		try {
			return await fetchSkills(query);
		} catch (error) {
			console.error("Error fetching skill suggestions:", error);
			return [];
		} finally {
			setIsLoading(false);
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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		debouncedFetchSuggestions(skillInput);
		return () => {
			debouncedFetchSuggestions.cancel();
		};
	}, [skillInput, debouncedFetchSuggestions]);

	const handleAddSkills = () => {
		if (skillInput.trim() && !skills.includes(skillInput.trim())) {
			setSkills([...skills, skillInput.trim()]);
			setSkillInput("");
		}
	};

	const handleRemoveSkill = (index: number) => {
		setSkills(skills.filter((_, i) => i !== index));
	};

	const handleSelectSkill = (selectedSkill: string) => {
		if (!skills.includes(selectedSkill)) {
			setSkills([...skills, selectedSkill]);
			setSkillInput("");
			setOpen(false);
		}
	};
	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Skills</DialogTitle>
				<DialogDescription>
					Add your skills here which will help you find the right job
					for you.
				</DialogDescription>
			</DialogHeader>
			<div className="space-y-4 w-full md:max-w-md">
				<div className="flex gap-2" ref={containerRef}>
					<Popover open={open}>
						<PopoverTrigger asChild>
							<div className="relative flex-1">
								<Input
									placeholder="Add a Skill..."
									className="border w-full"
									value={skillInput}
									onChange={(e) =>
										setSkillInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleAddSkills();
											e.preventDefault();
										}
									}}
									onFocus={() => {
										if (skillInput.trim()) setOpen(true);
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
									{isLoading ? (
										<div className="flex items-center justify-center p-4 text-sm">
											Loading suggestions...
										</div>
									) : suggestions.length > 0 ? (
										<CommandGroup>
											{suggestions.map((suggestion) => (
												<CommandItem
													key={suggestion}
													onSelect={() =>
														handleSelectSkill(
															suggestion
														)
													}
													onMouseDown={(e) =>
														e.preventDefault()
													}
												>
													{suggestion}
												</CommandItem>
											))}
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
						onClick={handleAddSkills}
						className="bg-fleace font-bold font-mono"
					>
						Add
					</Button>
				</div>

				<ScrollArea className="h-32 rounded-md p-2 border border-black dark:border-white">
					<ul className="flex flex-wrap gap-2">
						{skills.map((skill, index) => (
							<li
								key={index}
								className="flex items-center border border-black dark:border-white text-black dark:text-white px-3 py-1 rounded-md"
							>
								<span>{skill}</span>
								<Button
									variant="ghost"
									size="sm"
									className="ml-2 text-black dark:text-white"
									onClick={() => handleRemoveSkill(index)}
								>
									<X className="w-4 h-4" />
								</Button>
							</li>
						))}
					</ul>
				</ScrollArea>
			</div>
			<DialogFooter>
				<Button
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						handleUpdateSkills();
					}}
				>
					Save changes
				</Button>
			</DialogFooter>
		</DialogContent>
	);
};

export default SkillsModal;
