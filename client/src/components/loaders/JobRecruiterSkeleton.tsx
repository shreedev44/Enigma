import { Skeleton } from "../ui/skeleton";

const JobRecruiterSkeleton = () => {
	return (
		<section>
			<Skeleton className="h-8 w-60 my-6" />
			<div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6 p-6 bg-black rounded-2xl max-w-5xl mx-auto">
				<Skeleton className="w-20 h-20 rounded-full" />
				<div className="space-y-4 w-full">
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
				</div>
			</div>
		</section>
	);
};

export default JobRecruiterSkeleton;
