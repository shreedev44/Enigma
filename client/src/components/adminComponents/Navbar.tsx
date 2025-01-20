import { Button } from "../ui/button";
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
import { removeAdmin } from "@/redux/adminSlice";
import { useDispatch } from "react-redux";
import useGetAdmin from "@/hooks/useGetAdmin";
import { useToast } from "@/hooks/use-toast";
import Messages from "@/constants/Messages";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const user = useGetAdmin()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleLogout = () => {
    dispatch(removeAdmin())
    toast({
      description: Messages.LOGOUT_SUCCESS
    })
  }

  return (
    <div className="dark:bg-black bg-primary-foreground outline outline-1 outline-gray-600 w-full flex h-20 items-center px-6 md:px-16 fixed top-0 justify-between z-30">
      <div className="font-mono font-extrabold text-3xl">
        Enigma <span className="text-bluegrey ml-3">Admin</span>
      </div>
      <div className="flex items-center">
        <button onClick={toggleTheme} className="m-4 hidden md:inline">
          {theme !== "light" ? <MdSunny /> : <IoMdMoon />}
        </button>
        {user ? (
          <Button
            className="font-bold ml-3 hidden md:inline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (<></>)}
      </div>
      <Sheet>
        <SheetTrigger className="md:hidden">
          <IoMenu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetClose asChild>
              <Button variant={"outline"} onClick={toggleTheme}>
                {theme !== "light" ? "Light Mode" : "Dark Mode"}
              </Button>
            </SheetClose>
          </SheetHeader>
          <SheetFooter>
            {user ? (
              <SheetClose asChild>
                <Button className="mt-10" onClick={handleLogout}>
                  Logout
                </Button>
              </SheetClose>
            ) : (<></>)}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navbar;
