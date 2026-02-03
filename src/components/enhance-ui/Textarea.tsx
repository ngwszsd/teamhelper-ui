import * as React from 'react';
import { Textarea as BaseTextarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

export interface EnhancedTextareaProps extends React.ComponentProps<
  typeof BaseTextarea
> {
  showCount?: boolean;
}

const EnhancedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  EnhancedTextareaProps
>(({ className, showCount = true, maxLength, onChange, ...props }, ref) => {
  const [uncontrolledLength, setUncontrolledLength] = React.useState(
    props.defaultValue ? String(props.defaultValue).length : 0
  );

  const isControlled = props.value !== undefined;
  const currentLength = isControlled
    ? String(props.value).length
    : uncontrolledLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setUncontrolledLength(e.target.value.length);
    }
    onChange?.(e);
  };

  if (!showCount || !maxLength) {
    return (
      <BaseTextarea
        className={className}
        ref={ref}
        maxLength={maxLength}
        onChange={onChange}
        {...props}
      />
    );
  }

  return (
    <div className="relative w-full">
      <BaseTextarea
        className={cn(className, 'pb-6')}
        ref={ref}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      <div className="absolute bottom-1 right-3 text-xs text-muted-foreground pointer-events-none bg-card px-1 py-0.5">
        {currentLength}
        {maxLength ? ` / ${maxLength}` : null}
      </div>
    </div>
  );
});
EnhancedTextarea.displayName = 'EnhancedTextarea';

export { EnhancedTextarea };
