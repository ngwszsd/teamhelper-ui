import { cn } from '@/lib/utils';
import { Skeleton } from '@th/ui';

interface IProps {
  className?: string;
  isSkeleton?: boolean;
  children: React.ReactNode;
}

export const DivSkeleton: React.FC<IProps> = ({
  className,
  children,
  isSkeleton = true,
}) => {
  if (!isSkeleton) return children;

  return <Skeleton className={cn(className)} />;
};
