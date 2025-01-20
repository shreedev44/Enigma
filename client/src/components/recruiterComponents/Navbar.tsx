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
import { recruiterRoutes } from "@/constants/routeUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetRecruiter, { useGetProfilePic } from "@/hooks/useGetRecruiter";
import { removeRecruiter } from "@/redux/recruiterSlice";
import { useDispatch } from "react-redux";
import defaultPic from "../../assets/default-avatar.jpg";
import { useToast } from "@/hooks/use-toast";
import Messages from "@/constants/Messages";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = useGetRecruiter();
  const profilePic = useGetProfilePic();

  const dispatch = useDispatch();
  const { toast } = useToast()

  const handleLogout = () => {
    dispatch(removeRecruiter());
    toast({
      description: Messages.LOGOUT_SUCCESS
    })
  };

  return (
    <div className="dark:bg-black bg-primary-foreground outline outline-1 outline-gray-600 w-full flex h-20 items-center px-6 md:px-16 fixed top-0 justify-between z-30">
      <div className="font-mono font-extrabold text-3xl">
        Enigma <span className="text-bluegrey ml-3">Recruiter</span>
      </div>
      <div>
        <Button className="bg-fleace text-fleace-foreground mr-3 font-bold hidden md:inline">
          Home
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-fleace font-bold text-fleace-foreground mr-3 hidden md:inline">
              <span>Jobs &nbsp; &#x25BC;</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Post Job</DropdownMenuItem>
            <DropdownMenuItem>My Jobs</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="bg-fleace text-fleace-foreground font-bold mr-3 hidden md:inline">
          Interviews
        </Button>
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
                  alt="@shadcn"
                />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="bg-fleace text-fleace-foreground font-bold ml-3 hidden md:inline"
            onClick={() => navigate(`/recruiter${recruiterRoutes.SIGNIN}`)}
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
              <Button variant={"outline"}>Home</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant={"outline"}>Post Job</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant={"outline"}>My Jobs</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant={"outline"}>Interviews</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant={"outline"} onClick={toggleTheme}>
                {theme !== "light" ? "Light Mode" : "Dark Mode"}
              </Button>
            </SheetClose>
            {user ? (
              <SheetClose asChild>
                <Button variant={"outline"}>Profile</Button>
              </SheetClose>
            ) : (<></>)}
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
                onClick={() => navigate(`/recruiter${recruiterRoutes.SIGNIN}`)}
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
