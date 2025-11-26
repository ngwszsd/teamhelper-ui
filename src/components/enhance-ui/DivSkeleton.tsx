import { cn } from '@/lib/utils';
import { Skeleton } from './../ui/skeleton';

interface DivSkeletonProps {
  className?: string;
  isSkeleton?: boolean;
  children: React.ReactNode;
}

export const DivSkeleton: React.FC<DivSkeletonProps> = ({
  className,
  children,
  isSkeleton = true,
}) => {
  if (!isSkeleton) return children;

  return <Skeleton className={cn(className)} />;
};
