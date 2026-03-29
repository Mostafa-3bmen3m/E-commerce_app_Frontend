interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={`bg-custom-secondary/20 animate-pulse rounded-lg ${className}`}></div>
  );
};

export const ProductSkeleton = () => (
    <div className="bg-custom-primary rounded-2xl p-4 space-y-4 border border-custom">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
    </div>
);

export const CategorySkeleton = () => (
    <div className="bg-custom-primary rounded-3xl p-6 h-40 flex flex-col justify-end border border-custom shadow-sm relative overflow-hidden group">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
    </div>
);
