/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import { studentRoutes } from "@/constants/routeUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoIosNavigate } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useGetProfilePic, useGetStudentData } from "@/hooks/useGetStudent";
import defaultPic from "@/assets/default-avatar.jpg";
import { myApplications, updateSkills } from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import EditProfileModal from "@/components/studentComponents/EditProfileModal";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	forgotPassword,
	getProfile,
	getAttemptAttendance,
	getProblemStats,
	leaderboardRank,
} from "@/api/common";
import HeatMap from "@/components/charts/HeatMap";
import DifficultyRadial from "@/components/charts/DifficultyRadial";
import ProblemRadial from "@/components/charts/ProblemRadial";
import { AcceptanceRadial } from "@/components/charts/AcceptanceRadial";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import ApplicationDrawer from "@/components/studentComponents/ApplicationsDrawer";
import { ApplicationWithJob } from "@/types/types";
import SkillsModal from "@/components/studentComponents/SkillsModal";
import { Role } from "@/types/formTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = ({
	userLevel = "student",
	ownProfile = true,
}: {
	userLevel: Role;
	ownProfile: boolean;
}) => {
	const { toast } = useToast();
	const studentData = useGetStudentData();

	const [isModalOpen, setModalOpen] = useState(false);
	const [profileLoading, setProfileLoading] = useState(true);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [githubProfile, setGithubProfile] = useState("");
	const [linkedinProfile, setLinkedinProfile] = useState("");
	const [profilePic, setProfilePic] = useState(
		useGetProfilePic() || defaultPic
	);
	const [solvedPerDifficulty, setSolvedPerDifficulty] = useState({
		Beginner: 0,
		Intermediate: 0,
		Advanced: 0,
	});
	const [problemsSolved, setProblemsSolved] = useState({
		solved: 0,
		exist: 0,
	});
	const [acceptance, setAcceptance] = useState({
		accepted: 0,
		rejected: 0,
	});
	const [attemptAttendance, setAttemptAttendance] = useState<
		{ date: string; count: number }[]
	>([]);
	const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
	const [pageData, setPageData] = useState({ page: 1, totalPages: 1 });
	const [rank, setRank] = useState("");
	const [skills, setSkills] = useState<string[]>([]);

	const navigate = useNavigate();
	const location = useLocation();

	const setPage = (page: number) => {
		setPageData((prev) => ({ ...prev, page }));
	};

	let userId = "";
	if (ownProfile) {
		userId = studentData._id;
	} else {
		const state = location.state || {};
		if (!state.userId) {
			if (userLevel === "student") {
				navigate(studentRoutes.PROFILE);
				return;
			} else {
				navigate(`/recruiter${studentRoutes.PROFILE}`);
				return;
			}
		}

		userId = state.userId;
	}
	useEffect(() => {
		(async () => {
			const response = await getProfile(userLevel, userId);

			if (response.success) {
				const { profile } = response.data;
				setFirstName(profile.firstName);
				setLastName(profile.lastName);
				setGithubProfile(profile.githubProfile);
				setLinkedinProfile(profile.linkedinProfile);
				setProfilePic(profile.profilePicture || defaultPic);
				setSkills(profile.skills);
				setProfileLoading(false);

				if (ownProfile) {
					const applicationResp = await myApplications();
					if (applicationResp.success) {
						setApplications(applicationResp.data.applications);
						setPageData((prev) => ({
							...prev,
							totalPages: applicationResp.data.totalPages,
						}));
					}
				}
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();

		(async () => {
			const response = await leaderboardRank(userLevel, userId);

			if (response.success) {
				setRank(String(response.data.rank));
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const response = await getProblemStats(userLevel, userId);

			if (response.success) {
				setSolvedPerDifficulty(
					response.data.stats.problemsSolvedByDifficulty
				);
				setProblemsSolved({
					solved: response.data.stats.totalProblemsSolved,
					exist: response.data.stats.totalProblemsExist,
				});
				setAcceptance({
					accepted: response.data.stats.acceptedAttempts,
					rejected: response.data.stats.notAcceptedAttempts,
				});
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const response = await getAttemptAttendance(userLevel, userId);

			if (response.success) {
				setAttemptAttendance(response.data.attemptsPerDay);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
	}, []);

	useEffect(() => {
		if (ownProfile) {
			(async () => {
				const response = await myApplications(`page=${pageData.page}`);

				if (response.success) {
					setApplications(response.data.applications);
					setPageData((prev) => ({
						...prev,
						totalPages: response.data.totalPages,
					}));
				} else {
					toast({
						description: response.error,
						variant: "destructive",
					});
				}
			})();
		}
	}, [pageData.page]);

	const changePassword = async () => {
		const response = await forgotPassword(studentData.email, "student");

		if (response.success) {
			toast({
				description: "Your password reset link was sent to your email",
			});
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	const handleUpdateSkills = async () => {
		const response = await updateSkills(skills);

		if (response.success) {
			toast({
				description: response.data.message,
			});
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[
					{ component: "Home", path: studentRoutes.HOME },
					{ component: "Profile" },
				]}
			/>
			<div className="grid grid-flow-row md:grid-flow-col grid-rows-3 gap-4 mt-10 px-5 md:px-20">
				<div className="row-span-3 bg-zinc-300 dark:bg-zinc-800 rounded-xl">
					<div className="flex justify-center max-w-md">
						<Avatar className="w-12 md:w-20 h-12 md:h-20 my-5">
							<AvatarImage src={profilePic} alt="image" />
							<AvatarFallback>
								<Skeleton className="w-12 md:w-20 h-12 md:h-20 my-5 rounded-full" />
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col justify-center ml-5">
							{profileLoading ? (
								<>
									<Skeleton className="h-4 w-[150px] mb-2" />
								</>
							) : (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<p className="font-bold text-2xl font-mono">
												{(firstName + lastName)
													.length <= 11
													? firstName + " " + lastName
													: (
															firstName +
															" " +
															lastName
													  ).slice(0, 11) + "..."}
											</p>
										</TooltipTrigger>
										<TooltipContent className="light:bg-black">
											{firstName + " " + lastName}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
							<p>Leaderboard Rank: {rank}</p>
						</div>
					</div>
					<div className="flex justify-start mt-6 pl-7 mb-10 md:pl-10">
						<div className="flex flex-col justify-center">
							<div className="flex flex-col justify-center">
								<p className="text-xl font-bold font-mono">
									Github
								</p>
								{profileLoading ? (
									<Skeleton className="h-4 w-[200px]" />
								) : (
									<div className="flex justify-start items-center">
										<p className="ml-2 text-xs mr-3">
											{githubProfile
												? githubProfile.slice(0, 30) +
												  "..."
												: "Not added"}{" "}
										</p>
										{githubProfile ? (
											<a
												href={githubProfile}
												target="_blank"
												className="cursor-pointer"
											>
												<IoIosNavigate size={20} />
											</a>
										) : (
											<></>
										)}
									</div>
								)}
							</div>
							<div className="flex flex-col justify-center mt-5">
								<p className="text-xl font-bold font-mono">
									LinkedIn
								</p>
								{profileLoading ? (
									<Skeleton className="h-4 w-[200px]" />
								) : (
									<div className="flex justify-start items-center">
										<p className="ml-2 text-xs mr-3">
											{linkedinProfile
												? linkedinProfile.slice(0, 30) +
												  "..."
												: "Not added"}{" "}
										</p>
										{linkedinProfile ? (
											<a
												href={linkedinProfile}
												target="_blank"
												className="cursor-pointer"
											>
												<IoIosNavigate size={20} />
											</a>
										) : (
											<></>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
					{ownProfile ? (
						<>
							<div className="flex justify-center mb-5 gap-3">
								<Dialog>
									<DialogTrigger>
										<Button
											size={"lg"}
											className="bg-fleace font-bold"
											disabled={profileLoading}
											onClick={() =>
												setModalOpen(!isModalOpen)
											}
										>
											Edit Profile
										</Button>
									</DialogTrigger>
									<EditProfileModal
										firstName={firstName}
										setFirstName={setFirstName}
										lastName={lastName}
										setLastName={setLastName}
										profilePicture={
											useGetProfilePic() || ""
										}
										setProfilePicture={setProfilePic}
										githubProfile={githubProfile}
										setGithubProfile={setGithubProfile}
										linkedinProfile={linkedinProfile}
										setLinkedinProfile={setLinkedinProfile}
										isModalOpen={isModalOpen}
										changePassword={changePassword}
									/>
								</Dialog>
								<Dialog>
									<DialogTrigger>
										<Button
											size={"lg"}
											className="bg-fleace font-bold"
											disabled={profileLoading}
											onClick={() =>
												setModalOpen(!isModalOpen)
											}
										>
											Skills
										</Button>
									</DialogTrigger>
									<SkillsModal
										skills={skills}
										setSkills={setSkills}
										handleUpdateSkills={handleUpdateSkills}
									/>
								</Dialog>
							</div>
							<hr className="border-t-2 border-fleace mb-5" />
							<div className="flex justify-center">
								<p className="text-2xl font-bold font-mono">
									Job Applications
								</p>
							</div>
							<div className="flex flex-col my-6 px-7 md:px-10">
								<Drawer>
									<DrawerTrigger asChild>
										<Button className="bg-fleace font-bold">
											My applications
										</Button>
									</DrawerTrigger>
									<ApplicationDrawer
										applications={applications}
										setApplications={setApplications}
										pageData={pageData}
										setPage={setPage}
										key={234}
									/>
								</Drawer>
							</div>
						</>
					) : (
						<>
							<div className="flex justify-center">
								<p className="text-2xl font-bold font-mono">
									Skills
								</p>
							</div>
							<div className="flex flex-col my-6 px-7 md:px-10">
								<ScrollArea className="h-40">
									{skills.map((value, index) => {
										return (
											<p
												key={index}
												className="text-lg font-bold font-mono"
											>
												- {value}
											</p>
										);
									})}
								</ScrollArea>
							</div>
						</>
					)}
				</div>
				<div className="row-span-3 md:col-span-4 bg-zinc-300 dark:bg-zinc-800 rounded-xl p-5">
					<span className="text-xl font-mono font-bold">
						Problem stats
					</span>
					<div className="md:flex justify-around items-center my-5 bg-white dark:bg-zinc-900 rounded-xl">
						<DifficultyRadial {...solvedPerDifficulty} />
						<ProblemRadial {...problemsSolved} />
						<AcceptanceRadial {...acceptance} />
					</div>
					<HeatMap value={attemptAttendance} />
				</div>
			</div>
		</div>
	);
};

export default Profile;
