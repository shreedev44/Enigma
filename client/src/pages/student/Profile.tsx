import Breadcrumbs from "@/components/Breadcrumbs";
import { studentRoutes } from "@/constants/routeUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoIosNavigate } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useGetProfilePic, useGetStudentData } from "@/hooks/useGetStudent";
import defaultPic from "../../assets/default-avatar.jpg";
import {
	getAttemptAttendance,
	getProblemStats,
	getProfile,
} from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import EditProfileModal from "@/components/studentComponents/EditProfileModal";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { forgotPassword } from "@/api/common";
import HeatMap from "@/components/charts/HeatMap";
import DifficultyRadial from "@/components/charts/DifficultyRadial";
import ProblemRadial from "@/components/charts/ProblemRadial";
import { AcceptanceRadial } from "@/components/charts/AcceptanceRadial";

const Profile = () => {
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

	useEffect(() => {
		(async () => {
			const response = await getProfile();

			if (response.success) {
				const { profile } = response.data;
				setFirstName(profile.firstName);
				setLastName(profile.lastName);
				setGithubProfile(profile.githubProfile);
				setLinkedinProfile(profile.linkedinProfile);
				setProfilePic(profile.profilePicture || defaultPic);
				setProfileLoading(false);
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
			const response = await getProblemStats();

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
			const response = await getAttemptAttendance();

			if (response.success) {
				setAttemptAttendance(response.data.attemptsPerDay)
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
	}, []);

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
						</div>
					</div>
					<div className="flex justify-start mt-6 pl-7 md:pl-10">
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
					<div className="flex justify-center my-10">
						<Dialog>
							<DialogTrigger>
								<Button
									size={"lg"}
									className="bg-fleace font-bold"
									disabled={profileLoading}
									onClick={() => setModalOpen(!isModalOpen)}
								>
									Edit Profile
								</Button>
							</DialogTrigger>
							<EditProfileModal
								firstName={firstName}
								setFirstName={setFirstName}
								lastName={lastName}
								setLastName={setLastName}
								profilePicture={useGetProfilePic() || ""}
								setProfilePicture={setProfilePic}
								githubProfile={githubProfile}
								setGithubProfile={setGithubProfile}
								linkedinProfile={linkedinProfile}
								setLinkedinProfile={setLinkedinProfile}
								isModalOpen={isModalOpen}
								changePassword={changePassword}
							/>
						</Dialog>
					</div>
					<hr className="border-t-2 border-fleace mb-5" />
					<div className="flex justify-center">
						<p className="ml-5 text-2xl font-bold font-mono">
							Leaderboard
						</p>
					</div>
					<div className="flex justify-start my-6 pl-7 md:pl-10">
						<div className="flex justify-center">
							<p className="">Leaderboard Rank: 12</p>
						</div>
					</div>
				</div>
				<div className="row-span-3 md:col-span-4 bg-zinc-300 dark:bg-zinc-800 rounded-xl p-5">
					<span className="text-xl font-mono font-bold">
						Problem stats
					</span>
					<div className="flex justify-around items-center my-5 bg-white dark:bg-zinc-900 rounded-xl">
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
