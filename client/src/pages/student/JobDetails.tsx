import Breadcrumbs from "@/components/Breadcrumbs";
import JobDetailsSkeleton from "@/components/loaders/JobDetailsSkeleton";
import JobRecruiterSkeleton from "@/components/loaders/JobRecruiterSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { studentRoutes } from "@/constants/routeUrl";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const JobDetails = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { jobId } = location.state || {};

	const [loading, setLoading] = useState({ job: false, recruiter: false });

	useEffect(() => {
		if (!jobId) {
			navigate(studentRoutes.JOBS);
            return;
		}
	}, []);

	return (
		<div className="pt-24 px-3 md:px-20 pb-10">
			<Breadcrumbs
				components={[
					{ component: "Jobs", path: studentRoutes.JOBS },
					{ component: "adfasdf" },
				]}
			/>
			{loading.job ? (
				<JobDetailsSkeleton />
			) : (
				<>
					<section className="mt-10">
						<div className="md:flex items-center gap-10">
							<div className="p-5 bg-fleace flex md:w-1/2 justify-around items-center text-white dark:text-black rounded-2xl">
								<p className="text-lg md:text-2xl font-bold font-mono">
									Backend - end Developer at Apple
								</p>
							</div>
							<p className="ml-4">
								Posting closes on Dec 20, 2024
							</p>
						</div>
					</section>
					<section className="mt-8 md:mt-14">
						<p className="text-xl md:text-3xl font-bold font-mono">
							Job Description
						</p>
						<div className="mt-4 md:mt-8 p-4 bg-bluegrey flex justify-center rounded-2xl text-black md:w-3/4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-sm w-full">
								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Work Time:
									</span>
									<span className="text-lg">Full Time</span>
								</div>
								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Work Mode:
									</span>
									<span className="text-lg">Hybrid</span>
								</div>

								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Location:
									</span>
									<span className="text-lg">
										Calicut, Kerala
									</span>
								</div>
								<div className="flex justify-between md:justify-around items-center">
									<span className="font-semibold text-lg">
										Salary:
									</span>
									<span className="text-lg">6 - 7 LPA</span>
								</div>

								<div className="flex justify-between md:justify-around md:w-1/2 items-center sm:col-span-2">
									<span className="font-semibold text-lg">
										Experience:
									</span>
									<span className="text-lg">0 - 2 Years</span>
								</div>
							</div>
						</div>
					</section>
					<section className="mt-6 md:mt-10">
						<p className="text-lg md:text-xl font-bold font-mono ml-2 md:ml-5">
							Responsibilities
						</p>
						<div className="mt-3 md:mt-6">
							<ul className="list-disc ml-6 md:ml-14">
								<li>
									Develop and maintain backend services and
									APIs.
								</li>
								<li>
									Collaborate with cross-functional teams to
									define and implement new features.
								</li>
								<li>
									Ensure the performance, quality, and
									responsiveness of applications.
								</li>
								<li>
									Identify and fix bugs and performance
									bottlenecks.
								</li>
								<li>
									Write clean, maintainable, and scalable
									code.
								</li>
								<li>
									Participate in code reviews and provide
									constructive feedback.
								</li>
							</ul>
						</div>
					</section>
					<section className="mt-6 md:mt-10">
						<p className="text-lg md:text-xl font-bold font-mono ml-2 md:ml-5">
							Requirements
						</p>
						<div className="mt-3 md:mt-6">
							<ul className="list-disc ml-6 md:ml-14">
								<li>
									Proficiency in programming languages such as
									JavaScript, Python, or Java.
								</li>
								<li>
									Experience with backend frameworks like
									Node.js, Django, or Spring Boot.
								</li>
								<li>
									Strong understanding of RESTful APIs and
									microservices architecture.
								</li>
								<li>
									Familiarity with database technologies such
									as MySQL, PostgreSQL, or MongoDB.
								</li>
								<li>
									Knowledge of version control systems like
									Git.
								</li>
								<li>
									Excellent problem-solving skills and
									attention to detail.
								</li>
							</ul>
						</div>
					</section>
				</>
			)}

			{loading.recruiter ? (
				<JobRecruiterSkeleton />
			) : (
				<section className="mt-10 md:mt-14">
					<p className="text-xl md:text-3xl font-bold font-mono">
						About the Recruiter
					</p>
					<div className="mt-4 md:mt-8">
						<div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6 p-6 bg-black rounded-2xl max-w-5xl mx-auto">
							<div className="w-20 h-20 bg-[#ece7d6] rounded-full flex-shrink-0 mx-auto md:mx-0" />

							<div className="text-center md:text-left">
								<h1 className="text-2xl font-bold text-white mb-4">
									Brototype Pvt Ltd
								</h1>
								<p className="text-gray-300 leading-relaxed text-sm max-w-4xl">
									At Brototype Solutions, we specialize in
									building innovative software products that
									empower businesses to thrive in the digital
									age. With a focus on cutting-edge
									technologies and customer-centric solutions,
									we are dedicated to delivering excellence in
									every project we undertake. Our
									collaborative and inclusive culture values
									creativity, continuous learning, and
									innovation. With a diverse team of
									professionals, we foster an environment
									where ideas flourish, and careers thrive.
									Join us to be part of a dynamic company
									shaping the future of technology.
								</p>
							</div>
						</div>
					</div>
				</section>
			)}

			{!loading.job && (
				<section className="mt-10 md:mt-14">
					<p className="text-xl md:text-3xl font-bold font-mono">
						Apply to this role
					</p>
					<div className="mt-4 md:mt-8 md:ml-8">
						<p className="text-sm">
							Upload your resume (Ensure it is ATS-friendly).
						</p>
						<ul className="list-disc ml-6 mt-2 text-sm">
							<li>
								Use a simple and clean format without fancy
								designs.
							</li>
							<li>
								Include relevant keywords from the job
								description.
							</li>
							<li>
								Use standard section headings like "Experience"
								and "Education".
							</li>
							<li>Save your resume as a PDF or Word document.</li>
							<li>
								Ensure proper spelling and grammar throughout.
							</li>
						</ul>
						<div className="grid w-full max-w-sm items-center gap-1.5 mt-8">
							<Label htmlFor="resume">Resume (PDF)</Label>
							<Input id="resume" type="file" />
						</div>
						<Button
							variant={"default"}
							size={"lg"}
							className="bg-fleace mt-5 ml-3 rounded-full"
						>
							Apply
						</Button>
					</div>
				</section>
			)}
		</div>
	);
};

export default JobDetails;
