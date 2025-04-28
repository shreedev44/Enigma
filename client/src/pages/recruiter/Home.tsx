import Breadcrumbs from "@/components/Breadcrumbs";
import { recruiterRoutes } from "@/constants/routeUrl";
import hiringImage from "@/assets/hiring.jpg";
import postJobImage from "@/assets/post_job.png";
import interviewImage from "@/assets/intervew_card_image.png";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

const Home = () => {
    return (
        <div className="pt-24">
            <Breadcrumbs
                components={[{ component: "Home", path: recruiterRoutes.HOME }]}
            />
            <section>
                <div className="flex flex-col md:flex-row justify-around items-center mt-3 md:mt-10 px-3 md:px-20">
                    <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0">
                        <h1
                            className="text-4xl md:text-5xl font-bold leading-relaxed font-mono"
                            style={{ lineHeight: "1.3" }}
                        >
                            Revolutionize Your Tech <br /> Recruitment with{" "}
                            <br />
                            <span className="text-green-300 underline">
                                Enigma
                            </span>
                        </h1>
                        <p
                            className="mt-3 md:mt-10 text-gray-400"
                            style={{ lineHeight: "1.8" }}
                        >
                            Find the perfect candidate for your tech roles
                            faster and smarter with our intuitive recruitment
                            platform.
                        </p>
                    </div>
                    <img
                        src={hiringImage}
                        alt="img"
                        className="w-full md:w-2/5 rounded-3xl"
                    />
                </div>
            </section>
            <section className="my-5 md:my-10">
                <div className="flex flex-col md:flex-row justify-center items-center md:gap-20">
                    <div className="bg-[#c3e9f8] rounded-3xl p-8 flex flex-col items-center w-full md:w-1/3">
                        <img src={postJobImage} alt="img" className="mb-4" />
                        <h2 className="text-center text-black text-lg font-semibold mb-4">
                            Hire the Best Tech Talent with Our Comprehensive
                            Recruitment Platform
                        </h2>
                        <Button className="bg-black rounded-full text-white px-10 font-bold font-mono">
                            Post a Job <MoveRight />
                        </Button>
                    </div>
                    <div className="bg-[#d3f9fc] rounded-3xl p-8 flex flex-col items-center w-full md:w-1/3">
                        <img src={interviewImage} alt="img" className="mb-4" />
                        <h2 className="text-center text-black text-lg font-semibold mb-4">
                            Streamline Your Technical Interviews and Select the
                            Top Talent with Ease
                        </h2>
                        <Button className="bg-black rounded-full text-white px-10 font-bold font-mono">
                            Interview <MoveRight />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
