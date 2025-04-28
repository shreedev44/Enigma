import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUser, { useGetProfilePic } from "@/hooks/useGetStudent";
import { removeStudent } from "@/redux/studentSlice";
import { useDispatch } from "react-redux";
import { studentRoutes } from "@/constants/routeUrl";
import defaultPic from "../../assets/default-avatar.jpg";
import { useToast } from "@/hooks/use-toast";
import Messages from "@/constants/Messages";
import { Skeleton } from "../ui/skeleton";
// import { logout } from "@/api/student";

const Navbar = () => {
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const user = useGetUser();
	const profilePic = useGetProfilePic();

	const dispatch = useDispatch();
	const { toast } = useToast();

	const handleLogout = () => {
		dispatch(removeStudent());
		toast({
			description: Messages.LOGOUT_SUCCESS,
		});
		navigate(studentRoutes.HOME);
		// logout()
	};

	return (
		<div className="dark:bg-black bg-primary-foreground outline outline-1 outline-gray-600 w-full flex h-20 items-center px-6 md:px-16 fixed top-0 justify-between z-30">
			<div className="font-mono font-extrabold text-3xl">Enigma</div>
			<div>
				<Button
					className="bg-fleace text-fleace-foreground mr-3 font-bold hidden md:inline rounded-full"
					onClick={() => navigate(studentRoutes.HOME)}
				>
					Home
				</Button>
				<Button
					className="bg-fleace font-bold text-fleace-foreground mr-3 hidden md:inline rounded-full"
					onClick={() => navigate(studentRoutes.COMPILER)}
				>
					Compiler
				</Button>
				<Button
					className="bg-fleace text-fleace-foreground font-bold mr-3 hidden md:inline rounded-full"
					onClick={() => navigate(studentRoutes.PROBLEM_SET)}
				>
					Problems
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="bg-fleace font-bold text-fleace-foreground mr-3 hidden md:inline rounded-full">
							Jobs &nbsp; &#x25BC;
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Online Interview</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigate(studentRoutes.JOBS)}
						>
							Job Posts
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="flex items-center">
				<button onClick={toggleTheme} className="m-4 hidden md:inline">
					{theme !== "light" ? <MdSunny /> : <IoMdMoon />}
				</button>
				{user ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="hidden md:inline">
								<AvatarImage
									src={profilePic ? profilePic : defaultPic}
									alt="@image"
								/>
								<AvatarFallback>
									<Skeleton className="rounded-full w-10 h-10" />
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								onClick={() => navigate(studentRoutes.PROFILE)}
							>
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogout}>
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button
						className="bg-fleace text-fleace-foreground font-bold ml-3 hidden md:inline align-middle"
						onClick={() => navigate(studentRoutes.SIGNIN)}
					>
						Sign In
					</Button>
				)}
			</div>
			<Sheet>
				<SheetTrigger className="md:hidden">
					<IoMenu />
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Menu</SheetTitle>
						<SheetClose asChild>
							<Button
								variant={"outline"}
								onClick={() => navigate(studentRoutes.HOME)}
							>
								Home
							</Button>
						</SheetClose>
						<SheetClose asChild>
							<Button
								variant={"outline"}
								onClick={() => navigate(studentRoutes.COMPILER)}
							>
								Compiler
							</Button>
						</SheetClose>
						<SheetClose asChild>
							<Button
								variant={"outline"}
								onClick={() =>
									navigate(studentRoutes.PROBLEM_SET)
								}
							>
								Problems
							</Button>
						</SheetClose>
						<SheetClose asChild>
							<Button variant={"outline"}>
								Online Interview
							</Button>
						</SheetClose>
						<SheetClose asChild>
							<Button variant={"outline"}>Job Posts</Button>
						</SheetClose>
						<SheetClose asChild>
							<Button variant={"outline"} onClick={toggleTheme}>
								{theme !== "light" ? "Light Mode" : "Dark Mode"}
							</Button>
						</SheetClose>
						{user ? (
							<SheetClose asChild>
								<Button
									variant={"outline"}
									onClick={() =>
										navigate(studentRoutes.PROFILE)
									}
								>
									Profile
								</Button>
							</SheetClose>
						) : (
							<></>
						)}
					</SheetHeader>
					<SheetFooter>
						<SheetClose asChild>
							{user ? (
								<Button
									className="mt-10"
									onClick={handleLogout}
								>
									Logout
								</Button>
							) : (
								<Button
									className="mt-10"
									onClick={() =>
										navigate(studentRoutes.SIGNIN)
									}
								>
									Sign In
								</Button>
							)}
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default Navbar;
