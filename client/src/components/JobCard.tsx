import { JobCardProps } from "@/types/propsTypes";
import React from "react";

const JobCard: React.FC<JobCardProps> = ({
	companyName,
	profilePicture,
	role,
	workTime,
	workMode,
	jobLocation,
	minSalary,
	maxSalary,
	minimumExperience,
	lastDate,
	createdAt,
}) => {
	return (
		<>
            <div className="bg-slate-400 dark:bg-slate-700 rounded-2xl p-6 md:w-96 w-80 shadow-2xl shadow-gray-500/50 dark:shadow-gray-800/50 relative">
                <div className="flex items-center space-x-4 mb-4">
                    <img
                        src={profilePicture}
                        alt={`${companyName} logo`}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-bold tracking-wide">
                            {companyName}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Posted on{" "}
                            {new Date(createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold tracking-wide leading-tight">
                        {role}
                    </h3>
                    {lastDate && (
                        <p className="text-xs text-gray-500 mt-1">
                            Closes on{" "}
                            {new Date(lastDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    )}
                </div>

				<hr className="my-3 border-gray-500" />

				<div className="space-y-3 text-sm">
					<div className="flex justify-between">
						<span className="font-bold">Work Time</span>
						<span className="font-bold">{workTime}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-bold">Work Mode</span>
						<span className="font-bold">{workMode}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-bold">Location</span>
						<span className="font-bold">{jobLocation}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-bold">Salary (LPA)</span>
						<span className="font-bold">
							{minSalary
								? `${minSalary} - ${maxSalary}`
								: "Not disclosed"}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="font-bold">Min Experience (yrs)</span>
						<span className="font-bold">{minimumExperience}</span>
					</div>
				</div>

				<div className="flex justify-center items-center mt-6">
					<button className="px-10 py-2 border border-white rounded-full hover:bg-white hover:text-black transition font-medium">
						View
					</button>
				</div>
			</div>
		</>
	);
};

export default JobCard;
