import { Loader2Icon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useLocale } from '../ConfigProvider';

function Spinner({
  className,
  children,
  spinning = true,
  ...props
}: ComponentProps<'svg'> & { spinning?: boolean }) {
  const locale = useLocale();

  return (
    <div
      className={cn('relative', className)}
      aria-busy={spinning}
      aria-label={locale.loading}
    >
      {children}
      <Loader2Icon
        role="status"
        aria-label={locale.loading}
        className={cn(
          'size-4 animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        )}
        {...props}
      />
    </div>
  );
}

export { Spinner };
