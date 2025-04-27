import { Skeleton } from "@/components/ui/skeleton";

const JobDetailsSkeleton = () => {
	return (
		<div className="pt-24 px-3 md:px-20 pb-10 space-y-10">
			<section>
				<div className="md:flex items-center gap-10 space-y-4 md:space-y-0">
					<Skeleton className="h-28 md:w-1/2 w-full rounded-2xl" />
					<Skeleton className="h-6 w-40 ml-4" />
				</div>
			</section>

			<section>
				<Skeleton className="h-8 w-48 mb-6" />
				<div className="p-4 bg-bluegrey flex justify-center rounded-2xl text-black md:w-3/4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 w-full">
						{Array.from({ length: 5 }).map((_, idx) => (
							<Skeleton key={idx} className="h-6 w-full" />
						))}
					</div>
				</div>
			</section>

			<section>
				<Skeleton className="h-8 w-40 mb-6" />
				<div className="space-y-3 ml-6 md:ml-14">
					{Array.from({ length: 6 }).map((_, idx) => (
						<Skeleton key={idx} className="h-4 w-3/4" />
					))}
				</div>
			</section>

			<section>
				<Skeleton className="h-8 w-40 mb-6" />
				<div className="space-y-3 ml-6 md:ml-14">
					{Array.from({ length: 6 }).map((_, idx) => (
						<Skeleton key={idx} className="h-4 w-3/4" />
					))}
				</div>
			</section>

			<section>
				<Skeleton className="h-8 w-48 mb-6" />
				<div className="space-y-4 md:ml-8">
					<Skeleton className="h-4 w-60" />
					<div className="space-y-2 ml-6">
						{Array.from({ length: 5 }).map((_, idx) => (
							<Skeleton key={idx} className="h-4 w-72" />
						))}
					</div>
					<Skeleton className="h-10 w-60 mt-8" />
					<Skeleton className="h-10 w-36 rounded-full mt-5 ml-3" />
				</div>
			</section>
		</div>
	);
}

export default JobDetailsSkeleton