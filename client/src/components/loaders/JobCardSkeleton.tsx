import { Skeleton } from "@/components/ui/skeleton";

const JobCardSkeleton = () => {
  return (
    <div className="bg-slate-400 dark:bg-slate-700 rounded-2xl p-6 md:w-96 w-80 shadow-2xl shadow-gray-500/50 dark:shadow-gray-800/50 relative">
      
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <Skeleton className="h-5 w-[180px]" />
        <Skeleton className="h-3 w-[120px]" />
      </div>

      <hr className="my-3 border-gray-500" />

      <div className="space-y-4 text-sm">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}

export default JobCardSkeleton