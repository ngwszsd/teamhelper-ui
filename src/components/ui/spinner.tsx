import { Loader2Icon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

function Spinner({ className, children, ...props }: ComponentProps<'svg'>) {
  const { t } = useTranslation('components');
  return (
    <div className={cn('relative', className)}>
      {children}
      <Loader2Icon
        role="status"
        aria-label={t('loadingAria')}
        className={cn(
          'size-4 animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        )}
        {...props}
      />
    </div>
  );
}

export { Spinner };
