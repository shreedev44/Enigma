import Breadcrumbs from "@/components/Breadcrumbs";
import { studentRoutes } from "@/constants/routeUrl";
import cardImage1 from "../../assets/home_card1.png";
import cardImage2 from "../../assets/home card.png";
import cardImage3 from "../../assets/home_card3.png";
import communityImage from "../../assets/community.jpg";
import codeIconBlack from "../../assets/code-black.png";
import codeIconFleace from "../../assets/code-fleace.png";
import interviewImage from "../../assets/interview.png";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Home = () => {
  const { theme } = useTheme();
  return (
    <div className="pt-24">
      <Breadcrumbs
        components={[{ component: "Home", path: studentRoutes.HOME }]}
      />
      <section className="md:flex justify-around mt-5 md:mt-10 items-center">
        <div className="flex flex-col gap-5">
          <span className="text-4xl md:text-6xl md:max-w-2xl md:tracking-wide text-bold">
            Unlock the riddles of Programming with
          </span>
          <span className="text-4xl md:text-6xl font-extrabold font-mono text-mildgreen">
            Enigma
          </span>
        </div>
        <div className="hidden md:flex flex-col text-2xl font-bold font-mono tracking-wide">
          <span className="text-bluegrey">Learn</span>
          <span className="text-fleace">Compete</span>
          <span className="text-mildgreen">Master</span>
        </div>
      </section>

      <section className="md:flex md:justify-center gap-10 my-10 md:mt-20 items-end px-5 md:px-0">
        <div className="md:w-1/5 bg-bluegrey text-bluegrey-foreground rounded-3xl p-3 border border-black md:mb-0 mb-3">
          <img src={cardImage1} alt="img" className="rounded-3xl w-fit" />
          <div className="text-lg/5 font-bold my-7 text-center">
            Connecting ambitious professionals with the best opportunities.
          </div>
          <div className="flex justify-center mb-3">
            <Button
              className="bg-bluegrey rounded-full font-bold font-mono"
              variant={"outline"}
            >
              Explore Jobs <MoveRight />
            </Button>
          </div>
        </div>
        <div className="md:w-2/5 bg-teal-50 text-bluegrey-foreground rounded-3xl p-3 border border-black md:mb-0 mb-3">
          <img src={cardImage2} alt="img" className="rounded-3xl w-fit" />
          <div className="text-xl/5 font-bold my-7 text-center px-5">
            Challenge your coding skills with a variety of problems and rise to
            the top.
          </div>
          <div className="flex justify-center mb-3">
            <Button
              className="bg-teal-50 rounded-full font-bold font-mono"
              variant={"outline"}
            >
              Explore Problems <MoveRight />
            </Button>
          </div>
        </div>
        <div className="md:w-1/5 dark:bg-fleace text-bluegrey-foreground rounded-3xl p-3 border border-black md:mb-0 mb-3">
          <img src={cardImage3} alt="img" className="rounded-3xl w-fit" />
          <div className="text-lg/5 font-bold my-7 text-center">
            A community for coders to learn, grow, and share knowledge.
          </div>
          <div className="flex justify-center mb-3">
            <Button
              className="text-white dark:text-black dark:hover:text-white bg-fleace rounded-full font-bold font-mono"
              variant={"outline"}
            >
              Explore Community <MoveRight />
            </Button>
          </div>
        </div>
      </section>

      <section className="px-24 my-10 mt-20 hidden md:block">
        <div className="flex rounded-3xl bg-white border border-black">
          <div className="flex flex-col gap-7 justify-center">
            <span className="text-black text-4xl font-bold font-mono text-center">
              Gain valuable insights and clear coding doubts with a community of
              experts.
            </span>
            <div className="flex justify-center">
              <Button
                className="rounded-full border border-black max-w-1/2 bg-black text-white hover:text-black font-bold font-mono"
                size={"lg"}
              >
                Go to Community <MoveRight />
              </Button>
            </div>
          </div>
          <img
            src={communityImage}
            alt="img"
            className="w-1/2 rounded-3xl mt-10"
          />
        </div>
      </section>

      <section className="px-5 md:px-24 mb-20">
        <div className="md:flex justify-center gap-20 items-center">
          <div>
            <p className="text-4xl md:text-6xl md:max-w-2xl md:tracking-wide text-bold text-center">
              <span className="text-4xl md:text-6xl font-extrabold font-mono text-mildgreen">
                Enigma
              </span>
              &nbsp; Online Compiler
            </p>
          </div>
          {theme === "dark" ? (
            <img
              src={codeIconFleace}
              alt="img"
              className="w-1/6 hidden md:block"
            />
          ) : (
            <img
              src={codeIconBlack}
              alt="img"
              className="w-1/6 hidden md:block"
            />
          )}
          <div className="md:hidden flex justify-center">
            {theme === "dark" ? (
              <img src={codeIconFleace} alt="img" className="w-1/6" />
            ) : (
              <img src={codeIconBlack} alt="img" className="w-1/6" />
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-start justify-center md:gap-20">
          <span className="md:w-1/3 text-sm text-center md:text-start font-bold font-mono">
            Code, test, and run programs in multiple languages with an
            all-in-one online compiler.
          </span>
          <Button
            className="rounded-full md:w-1/5 h-14 bg-fleace text-fleace-foreground font-bold 
            font-mono text-lg mt-5 md:mt-0 dark:hover:bg-black dark:hover:text-fleace dark:border 
            dark:border-fleace"
            size={"lg"}
          >
            Try Compiler <MoveRight />
          </Button>
        </div>
      </section>

      <section className="px-5 md:px-32 mb-20">
        <div className="flex flex-col md:flex-row p-5 rounded-3xl bg-bluegrey">
          <img
            src={interviewImage}
            alt="img"
            className="rounded-3xl md:w-1/2"
          />
          <div className="flex flex-col justify-center items-center gap-7">
            <span className="md:text-2xl text-center font-bold font-mono text-bluegrey-foreground mt-3 md:mt-0 md:px-10">
              Attend coding interviews with real-time video and online compiler
              sessions.
            </span>
            <Button
              className="rounded-full bg-mildgreen text-mildgreen-foreground font-bold font-mono dark:hover:bg-black dark:hover:text-white"
              size={"lg"}
            >
              Interviews <MoveRight />
            </Button>
            <Button
              className="rounded-full bg-indigo-700 font-bold font-mono text-white dark:hover:text-black"
              size={"lg"}
            >
              View Job Posts <MoveRight />
            </Button>
          </div>
        </div>
      </section>
      <div className="mb-10 px-4">
        <hr className="border-2 dark:border-white border-black rounded-full" />
      </div>

      <footer>
        <div className="flex flex-col my-20 px-5 md:px-24">
          <span className="text-5xl font-bold font-mono">Enigma</span>
          <span className="text-md font-mono">Unlock the riddles of Programming</span>
        </div>

        <div className="mb-2 px-24">
          <hr className="border-1 dark:border-white border-black rounded-full" />
        </div>
        <div className="flex justify-center">
          <span>© Copyrights reserved</span>
        </div>
      </footer>

    </div>
  );
};

export default Home;
