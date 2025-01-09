import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="dark:bg-black outline outline-1 outline-gray-600 w-full flex h-20 items-center px-6 md:px-16 fixed top-0 justify-between z-30">
      <div className="font-mono font-extrabold text-3xl">Enigma <span className="text-bluegrey ml-3">Admin</span></div>
      <div>
        <button onClick={toggleTheme} className="m-4 hidden md:inline">
          {theme !== "light" ? <MdSunny /> : <IoMdMoon />}
        </button>
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navbar;
