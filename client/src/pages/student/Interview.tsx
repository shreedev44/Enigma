import Breadcrumbs from "@/components/Breadcrumbs";
import interviewImage1 from "@/assets/interview.jpg";
import interviewImage2 from "@/assets/interview.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { studentRoutes } from "@/constants/routeUrl";
import { useState } from "react";

const Interview = () => {
	const navigate = useNavigate();

	const [code, setCode] = useState("");

	const handleJoin = () => {
		if (!code) {
			return;
		}

		navigate(studentRoutes.MEETING + "?roomID=" + code);
	};
	return (
		<div className="pt-24">
			<Breadcrumbs components={[{ component: "Interview" }]} />
			<div className="flex justify-center pt-10 md:pt-20">
				<div
					className="flex justify-between items-center rounded-3xl border border-blue-400 
                bg-[#b3b9dc] p-8 md:p-12 text-black max-w-8xl mx-auto mx-5 md:mx-0"
				>
					<div className="w-full md:w-1/2 space-y-6">
						<h1 className="text-3xl md:text-4xl font-semibold leading-snug">
							Ace your technical interviews with <br />
							our{" "}
							<span className="font-bold">
								real-time coding
							</span>{" "}
							and{" "}
							<span className="font-bold">
								communication platform.
							</span>
						</h1>
						<p className="text-sm md:text-base max-w-md font-medium text-black/80">
							Simulate a real technical interview with a virtual
							environment that includes real-time communication
							and an online compiler. Practice your coding and
							communication skills to ace your next interview with
							ease.
						</p>

						<label className="block font-semibold">
							Enter your interview code
						</label>
						<div className="md:flex align-baseline">
							<div>
								<Input
									type="text"
									placeholder="asf23a1234"
									className="bg-white"
									value={code}
									onChange={(e) => setCode(e.target.value)}
								/>
							</div>
							<Button
								className="bg-mildgreen w-full md:w-auto mt-3 md:mt-0 md:ml-2 font-bold font-mono"
								onClick={handleJoin}
							>
								Join
							</Button>
						</div>
					</div>

					<div className="hidden md:flex flex-col gap-4 w-1/2 pl-10">
						<img
							src={interviewImage1}
							alt="Interview Room"
							className="rounded-lg object-cover h-48 w-full"
						/>
						<img
							src={interviewImage2}
							alt="Online Interview"
							className="rounded-lg object-cover h-48 w-full"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Interview;
