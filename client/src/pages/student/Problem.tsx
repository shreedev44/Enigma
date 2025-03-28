import {
	findAttempt,
	findProblem,
	getAttempts,
	runSolution,
	submitSolution,
} from "@/api/student";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { studentRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { AttemptType, Language, ProblemType } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/CodeEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import { defineFunction } from "@/utils/defineFunction";
import { Badge } from "@/components/ui/badge";
import { FaCode } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { SiTestcafe } from "react-icons/si";
import { GoCommandPalette } from "react-icons/go";
import { RxTimer } from "react-icons/rx";
import { MdMemory } from "react-icons/md";
import { PiCodeBlockBold } from "react-icons/pi";
import CommandLoader from "@/components/loaders/CommandLoading";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import useGetStudent from "@/hooks/useGetStudent";

const useScreenWidth = () => {
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth);

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return width;
};

const Problem = () => {
	const { problemNo } = useParams<{ problemNo: string }>();
	const [problem, setProblem] = useState<ProblemType | null>(null);
	const [loading, setLoading] = useState({
		content: false,
		run: false,
		submit: false,
		attempts: false,
		attemptDetails: false,
	});
	const [code, setCode] = useState(``);
	const [language, setLanguage] = useState<Language>("javascript");
	const [testResult, setTestResult] = useState({
		output: [],
		result: [],
		expected: [],
	});
	const [compileError, setCompileError] = useState("");
	const [testTab, setTestTab] = useState<"testCases" | "testResult">(
		"testCases"
	);
	const [key, setKey] = useState(0);
	const [attempts, setAttempts] = useState<
		Pick<AttemptType, "_id" | "createdAt" | "language" | "status">[]
	>([]);
	const [selectedAttempt, setSelectedAttempt] = useState<AttemptType | null>(
		null
	);

	const user = useGetStudent();

	const navigate = useNavigate();
	const { toast } = useToast();

	const screenWidth = useScreenWidth();

	const changeTab = (tab: "testCases" | "testResult") => {
		setTestTab(tab);
		setKey(key === 0 ? 1 : 0);
	};

	useEffect(() => {
		if (!problemNo || isNaN(Number(problemNo))) {
			navigate(studentRoutes.PROBLEM_SET);
			return;
		}
		(async () => {
			setLoading({ ...loading, content: true });
			const response = await findProblem(Number(problemNo));

			if (response.success) {
				setProblem(response.data.problem);
				setLoading({ ...loading, content: false });
				(async () => {
					if (!user) {
						return;
					}
					setLoading({ ...loading, attempts: true });
					const attemptResponse = await getAttempts(response.data.problem.problemNo);

					if (attemptResponse.success) {
						setAttempts(
							attemptResponse.data.attempts as Pick<
								AttemptType,
								"_id" | "createdAt" | "language" | "status"
							>[]
						);
						if(attemptResponse.data.attempts.length) {
							setCode(attemptResponse.data.attempts[0].solution)
							setLanguage(attemptResponse.data.attempts[0].language)
						}
						setLoading({ ...loading, attempts: false });
					} else {
						toast({
							description: attemptResponse.error,
							variant: "destructive",
						});
						setLoading({ ...loading, attempts: false });
					}
				})();
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				navigate(studentRoutes.PROBLEM_SET);
				setLoading({ ...loading, content: false });
			}
		})();
	}, []);

	useEffect(() => {
		setCode(defineFunction(problem as ProblemType, language));
	}, [problem, language]);

	const handleRun = async () => {
		setLoading({ ...loading, run: true });
		if (!problem) return;
		if (!code) return;
		changeTab("testResult");
		const response = await runSolution(
			code,
			language,
			problem?.problemNo as number
		);

		if (response.success) {
			if (response.data.result.stderr) {
				setCompileError(response.data.result.stderr);
				setLoading({ ...loading, run: false });
				return;
			}

			const { result, output, expected } = JSON.parse(
				response.data.result.stdout
			);
			setTestResult({ result, output, expected });
			setCompileError("");
			setLoading({ ...loading, run: false });
		} else {
			setLoading({ ...loading, run: false });
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	const handleSubmit = async () => {
		setLoading({ ...loading, submit: true });
		if (!problem) return;
		if (!code) return;

		const response = await submitSolution(
			code,
			language,
			problem.problemNo as number
		);

		if (response.success) {
			const attemptObj = {
				_id: response.data._id,
				status: response.data.status,
				language: response.data.language,
				createdAt: response.data.createdAt,
			};
			setAttempts([attemptObj, ...attempts]);
			setSelectedAttempt(response.data);
			setLoading({ ...loading, submit: false });
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading({ ...loading, submit: false });
		}
	};

	const fetchAttempt = async (id: string) => {
		setLoading({ ...loading, attemptDetails: true });
		const response = await findAttempt(id);

		if (response.success) {
			setSelectedAttempt(response.data.attempt);
			setLoading({ ...loading, attemptDetails: false });
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading({ ...loading, attemptDetails: false });
		}
	};

	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[
					{ component: "Home", path: studentRoutes.HOME },
					{ component: "Problems", path: studentRoutes.PROBLEM_SET },
					{ component: problem?.title || "Problem" },
				]}
			/>
			{loading.content ? (
				<Skeleton className="flex h-[500px] m-4 rounded-lg" />
			) : (
				<>
					<div className="flex flex-col min-h-64 bg-zinc-200 dark:bg-zinc-900 m-4 rounded-lg py-2 px-4 md:py-5 md:px-16">
						<ScrollArea className="h-[500px]">
							<div className="text-lg md:text-2xl font-bold font-mono">
								{problem?.problemNo} {"- "} {problem?.title}
							</div>
							<span
								className={`md:ml-8 mb-5 font-bold text-sm md:text-lg font-mono ${
									problem?.difficulty === "Beginner"
										? "text-green-500"
										: problem?.difficulty === "Intermediate"
										? "text-yellow-500"
										: "text-red-500"
								}`}
							>
								{problem?.difficulty}
							</span>
							<div className="whitespace-pre-wrap">
								{problem?.description}
							</div>
							<p className="text-xl font-bold font-mono mt-10 mb-3">
								Constraints
							</p>
							<div>
								{problem?.constraints &&
									problem?.constraints.map((constraint) => {
										return (
											<>
												<p>{constraint}</p>
												<br />
											</>
										);
									})}
							</div>
						</ScrollArea>
					</div>
					<div className="mx-4 mb-4">
						<ResizablePanelGroup
							direction={`${
								screenWidth >= 768 ? "horizontal" : "vertical"
							}`}
							className="min-h-[200px] w-full rounded-lg border md:min-w-[450px]"
						>
							<ResizablePanel
								defaultSize={70}
								minSize={50}
								maxSize={80}
							>
								<div>
									<div className="flex justify-between items-center">
										<div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														size={"sm"}
														className="m-2"
														variant="outline"
														disabled={
															loading.content
														}
													>
														Language{" "}
														<IoIosArrowDown />{" "}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-56">
													<DropdownMenuLabel>
														Select Language
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuRadioGroup
														value={language}
														onValueChange={(
															value
														) =>
															setLanguage(
																value as Language
															)
														}
													>
														<DropdownMenuRadioItem value="javascript">
															Javascript
														</DropdownMenuRadioItem>
														<DropdownMenuRadioItem value="python">
															Python
														</DropdownMenuRadioItem>
													</DropdownMenuRadioGroup>
												</DropdownMenuContent>
											</DropdownMenu>
											<Badge variant={"secondary"}>
												{language}
											</Badge>
										</div>
										<div>
											<Button
												size={"sm"}
												className="bg-mildgreen"
												onClick={handleRun}
											>
												{loading.run ? (
													<ClassicSpinner size={4} />
												) : (
													"Run"
												)}
												<FaCode />
											</Button>
											<Button
												size={"sm"}
												className="bg-fleace mx-3"
												onClick={handleSubmit}
											>
												{loading.submit ? (
													<ClassicSpinner size={4} />
												) : (
													"Submit"
												)}
												<FiUploadCloud />
											</Button>
										</div>
									</div>
									<CodeEditor
										code={code}
										setCode={setCode}
										height="400px"
										language={language}
									/>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle />
							<ResizablePanel
								defaultSize={30}
								minSize={20}
								maxSize={50}
							>
								<div className="flex h-full justify-center p-6">
									<Tabs
										defaultValue={testTab}
										className="w-[400px]"
										key={key}
									>
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="testCases">
												Test Cases
												<SiTestcafe className="ml-2" />
											</TabsTrigger>
											<TabsTrigger value="testResult">
												Test Result
												<GoCommandPalette className="ml-2" />
											</TabsTrigger>
										</TabsList>
										<TabsContent value="testCases">
											<Card>
												<ScrollArea className="h-[300px]">
													<CardContent className="space-y-2 pt-5">
														{problem?.testCases &&
															problem.testCases.map(
																(
																	testCase,
																	index
																) => {
																	return (
																		<div
																			key={
																				index
																			}
																			className="mb-5"
																		>
																			<span className="font-extrabold">
																				Test
																				Case:{" "}
																				{index +
																					1}
																			</span>
																			<br />
																			<span className="ml-2 font-bold">
																				Input
																			</span>
																			<div className="rounded-md bg-zinc-200 dark:bg-zinc-900 p-1">
																				{testCase.input.map(
																					(
																						input,
																						index
																					) => {
																						return (
																							<div
																								key={
																									index
																								}
																								className="ml-3"
																							>
																								<span>
																									{
																										input.parameter
																									}{" "}
																									={" "}
																								</span>
																								<span>
																									{typeof input.value ===
																									"object"
																										? "[" +
																										  input.value +
																										  "]"
																										: input.value}
																								</span>
																							</div>
																						);
																					}
																				)}
																			</div>
																		</div>
																	);
																}
															)}
													</CardContent>
												</ScrollArea>
											</Card>
										</TabsContent>
										<TabsContent value="testResult">
											<Card>
												<ScrollArea className="h-[300px]">
													<CardContent className="space-y-2 pt-5">
														{!loading.run &&
														!testResult.result
															.length &&
														!compileError
															? "Test your result by running your solution"
															: ""}
														{loading.run ? (
															<div className="flex justify-center">
																<CommandLoader />
															</div>
														) : (
															<></>
														)}
														{compileError !== "" &&
														!loading.run ? (
															<span className="text-red-500 whitespace-pre-wrap">
																Compile Error{" "}
																<br />
																{compileError}
															</span>
														) : (
															<></>
														)}

														{(problem?.testCases
															?.length ?? 0) >
															0 &&
															testResult?.result
																?.length > 0 &&
															!loading.run &&
															!compileError &&
															(
																problem?.testCases ??
																[]
															).map(
																(
																	testCase,
																	index
																) => {
																	return (
																		<div
																			key={
																				index
																			}
																			className="mb-5"
																		>
																			<span className="font-extrabold">
																				Test
																				Case:{" "}
																				{index +
																					1}{" "}
																				<span
																					className={`ml-2 ${
																						testResult
																							.result[
																							index
																						]
																							? "text-green-500"
																							: "text-red-500"
																					}`}
																				>
																					{testResult
																						.result[
																						index
																					]
																						? "Accepted"
																						: "Rejected"}
																				</span>
																			</span>
																			<br />
																			<span className="ml-2 font-bold">
																				Input
																			</span>
																			<div className="rounded-md bg-zinc-200 dark:bg-zinc-900 p-1">
																				{testCase.input.map(
																					(
																						input,
																						i
																					) => (
																						<div
																							key={
																								i
																							}
																							className="ml-3"
																						>
																							<span>
																								{
																									input.parameter
																								}{" "}
																								={" "}
																							</span>
																							<span>
																								{typeof input.value ===
																								"object"
																									? "[" +
																									  input.value +
																									  "]"
																									: input.value}
																							</span>
																						</div>
																					)
																				)}
																			</div>
																			<span className="ml-2 font-bold">
																				Expected
																			</span>
																			<div className="rounded-md bg-zinc-200 dark:bg-zinc-900 p-1 pl-3">
																				<ScrollArea className="w-72">
																					{typeof String(
																						testResult
																							.expected?.[
																							index
																						]
																					) ===
																					"object"
																						? "[" +
																						  String(
																								testResult
																									.expected?.[
																									index
																								]
																						  ) +
																						  "]"
																						: String(
																								testResult
																									.expected?.[
																									index
																								]
																						  )}
																					<ScrollBar orientation="horizontal" />
																				</ScrollArea>
																			</div>
																			<span className="ml-2 font-bold">
																				Output
																			</span>
																			<div className="rounded-md bg-zinc-200 dark:bg-zinc-900 p-1 pl-3">
																				<ScrollArea className="w-72">
																					{typeof String(
																						testResult
																							.output?.[
																							index
																						]
																					) ===
																					"object"
																						? "[" +
																						  String(
																								testResult
																									.output?.[
																									index
																								]
																						  ) +
																						  "]"
																						: String(
																								testResult
																									.output?.[
																									index
																								]
																						  )}
																					<ScrollBar orientation="horizontal" />
																				</ScrollArea>
																			</div>
																		</div>
																	);
																}
															)}
													</CardContent>
												</ScrollArea>
											</Card>
										</TabsContent>
									</Tabs>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
					<div className="mx-4 mb-4">
						<ResizablePanelGroup
							direction="horizontal"
							className="border rounded-lg min-h-[200px] md:min-h-[250px]"
						>
							<ResizablePanel
								className="border p-3"
								defaultSize={50}
							>
								<div className="flex justify-center mb-5">
									<span className="font-bold font-mono text-fleace text-xl">
										Attempts
									</span>
								</div>
								<ScrollArea className="h-[250px]">
									<div>
										{attempts.length ? (
											attempts.map(
												(
													attempt: Pick<
														AttemptType,
														| "_id"
														| "createdAt"
														| "language"
														| "status"
													>
												) => {
													return (
														<div
															onClick={() =>
																fetchAttempt(
																	attempt._id
																)
															}
															className="border rounded-md p-2 flex justify-around cursor-pointer mb-2"
														>
															<span
																className={`text-${
																	attempt.status ===
																	"Accepted"
																		? "green-500"
																		: "red-500"
																} font-bold`}
															>
																{attempt.status}
															</span>
															<span>
																{
																	attempt.language
																}
															</span>
															<span>
																{new Date(
																	attempt.createdAt
																).toLocaleDateString(
																	undefined,
																	{
																		year: "numeric",
																		month: "long",
																		day: "numeric",
																	}
																)}
															</span>
														</div>
													);
												}
											)
										) : (
											<div className="flex justify-center">
												<span className="mt-28">
													No Attempts yet
												</span>
											</div>
										)}
									</div>
								</ScrollArea>
							</ResizablePanel>
							<ResizablePanel
								className="border p-3 pb-0"
								defaultSize={50}
							>
								<div className="flex justify-center">
									<span className="font-bold font-mono text-fleace text-xl">
										Details
									</span>
								</div>
								{selectedAttempt ? (
									<ScrollArea className="h-[250px]">
										<div className="mt-5 px-5 pb-3">
											<div className="flex justify-between">
												<span
													className={`text-${
														selectedAttempt?.status ===
														"Accepted"
															? "green-500"
															: "red-500"
													} font-bold font-mono text-xl`}
												>
													{selectedAttempt.status}
													{selectedAttempt.status ===
													"Rejected"
														? "  -  " +
														  selectedAttempt.rejectionMessage
														: ""}
												</span>
												<span>
													{new Date(
														selectedAttempt.createdAt
													).toLocaleDateString(
														undefined,
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														}
													)}
												</span>
											</div>
											{selectedAttempt.status ===
											"Rejected" ? (
												<div className="my-5">
													<span className="ml-2 font-bold">
														Expected
													</span>
													<div className="rounded-md bg-zinc-200 dark:bg-zinc-900 p-1 pl-3 mb-3">
														<ScrollArea className="w-72">
															{typeof String(
																selectedAttempt
																	.rejectedTestCase
																	?.expected
															) === "object"
																? "[" +
																  String(
																		selectedAttempt
																			.rejectedTestCase
																			?.expected
																  ) +
																  "]"
																: String(
																		selectedAttempt
																			.rejectedTestCase
																			?.expected
																  )}
															<ScrollBar orientation="horizontal" />
														</ScrollArea>
													</div>
													<span className="ml-2 font-bold">
														Output
													</span>
													<div className="rounded-md bg-zinc-200 dark:bg-zinc-900 p-1 pl-3">
														<ScrollArea className="w-72">
															{typeof String(
																selectedAttempt
																	.rejectedTestCase
																	?.output
															) === "object"
																? "[" +
																  String(
																		selectedAttempt
																			.rejectedTestCase
																			?.output
																  ) +
																  "]"
																: String(
																		selectedAttempt
																			.rejectedTestCase
																			?.output
																  )}
															<ScrollBar orientation="horizontal" />
														</ScrollArea>
													</div>
												</div>
											) : (
												<></>
											)}
											{selectedAttempt.status ===
											"Compile Error" ? (
												<div className="px-5 py-3 bg-zinc-200 dark:bg-zinc-900 rounded-lg flex text-red-500">
													{
														selectedAttempt.rejectionMessage
													}
												</div>
											) : (
												<></>
											)}
											<div className="flex justify-around mt-8">
												<div className="px-5 py-3 bg-zinc-200 dark:bg-zinc-900 rounded-lg flex flex-col">
													<div className="flex items-center gap-2 text-xl font-mono font-bold">
														<RxTimer
															size={19}
															color="red"
														/>{" "}
														Runtime
													</div>
													<div className="text-center font-bold text-xl">
														{selectedAttempt.runTime +
															"s"}
													</div>
												</div>
												<div className="px-5 py-3 bg-zinc-200 dark:bg-zinc-900 rounded-lg flex flex-col">
													<div className="flex items-center gap-2 text-xl font-mono font-bold">
														<MdMemory
															size={19}
															color="blue"
														/>{" "}
														Memory
													</div>
													<div className="text-center font-bold text-xl">
														{selectedAttempt.memory}
													</div>
												</div>
												<div className="px-5 py-3 bg-zinc-200 dark:bg-zinc-900 rounded-lg flex flex-col">
													<div className="flex items-center gap-2 text-xl font-mono font-bold">
														<SiTestcafe
															size={19}
															color="green"
														/>{" "}
														Test Case Passed
													</div>
													<div className="text-center font-bold text-xl">
														{
															selectedAttempt.testCasePassed
														}
													</div>
												</div>
											</div>
											<div className="bg-zinc-200 dark:bg-zinc-900 rounded-lg flex flex-col whitespace-pre-wrap p-5 mt-8">
												<div className="flex items-center justify-between">
													<div className="flex items-center font-bold text-lg">
														<PiCodeBlockBold />
														<span> Solution</span>
													</div>
													<span className="font-bold font-mono">
														{
															selectedAttempt.language
														}
													</span>
												</div>
												<hr />
												<div className="mt-10 ml-5">
													{selectedAttempt.solution}
												</div>
											</div>
										</div>
									</ScrollArea>
								) : (
									<div className="flex justify-center mt-36">
										<span className="text-center">
											Select an attempt to view details
										</span>
									</div>
								)}
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</>
			)}
		</div>
	);
};

export default Problem;
