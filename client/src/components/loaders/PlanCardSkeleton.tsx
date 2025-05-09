import { Skeleton } from "../ui/skeleton";

const PlanCardSkeleton = () => {
	return (
		<div className="flex flex-col justify-between rounded-xl p-6 border border-gray-700">
			<Skeleton className="h-6 w-1/2 mb-1" />

			<Skeleton className="h-8 w-1/3 mb-4" />

			<Skeleton className="h-4 w-full my-5" />

			<Skeleton className="h-10 w-24 rounded-full" />
		</div>
	);
};

export default PlanCardSkeleton;
