import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
} from '../ui/button';
import { ButtonGroup } from '../ui/button-group';

export interface EnhancedButtonProps {
  type?: 'default' | 'primary' | 'dashed' | 'text' | 'link';
  size?: 'small' | 'middle' | 'large';
  shape?: 'default' | 'circle' | 'round';
  block?: boolean;
  danger?: boolean;
  ghost?: boolean;
  loading?: boolean | { delay?: number };
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  href?: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  htmlType?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}

/** 将 antd 的 type + danger 映射到基础 Button 的 variant */
function mapVariant(
  type: EnhancedButtonProps['type'],
  danger?: boolean
): NonNullable<BaseButtonProps['variant']> {
  if (type === 'primary') return danger ? 'destructive' : 'default';
  if (type === 'link') return 'link';
  if (type === 'text') return 'ghost';
  // default / dashed
  return 'outline';
}

/** 将 antd 的 size + shape 映射到基础 Button 的 size */
function mapSize(
  size: EnhancedButtonProps['size'],
  shape: EnhancedButtonProps['shape']
): NonNullable<BaseButtonProps['size']> {
  if (shape === 'circle') {
    if (size === 'small') return 'icon-sm';
    if (size === 'large') return 'icon-lg';
    return 'icon';
  }
  if (size === 'small') return 'sm';
  if (size === 'large') return 'lg';
  return 'default';
}

/** 组合附加样式以模拟 antd 的 ghost/dashed/danger 等 */
function buildExtraClasses(opts: {
  type?: EnhancedButtonProps['type'];
  danger?: boolean;
  ghost?: boolean;
  shape?: EnhancedButtonProps['shape'];
  block?: boolean;
}) {
  const { type = 'default', danger, ghost, shape, block } = opts;
  const extra: string[] = [];

  if (type === 'link') {
    extra.push('hover:no-underline hover:text-primary/70');
  }

  // dashed 边框
  if (type === 'dashed') {
    extra.push('border-dashed');
  }

  // ghost 透明风格
  if (ghost) {
    extra.push('bg-transparent');
    if (danger) {
      // 危险 + ghost
      extra.push('text-destructive border-destructive hover:bg-destructive');
    } else if (type === 'primary') {
      // 主色 + ghost
      extra.push('text-primary border-primary hover:bg-primary/10');
    }
  }

  // 非 primary 的 danger 走红色样式（primary 已用 destructive）
  if (danger && type !== 'primary') {
    if (type === 'link') {
      extra.push('text-destructive');
    } else if (type === 'text') {
      extra.push('text-destructive hover:bg-destructive');
    } else {
      // default/dashed
      extra.push('text-destructive border-destructive hover:bg-destructive');
    }
  }

  // 形状
  if (shape === 'round' || shape === 'circle') {
    extra.push('rounded-full');
  }

  // block
  if (block) {
    extra.push('w-full');
  }

  return extra;
}

const InternalButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      type = 'default',
      size = 'middle',
      shape = 'default',
      block,
      danger,
      ghost,
      loading = false,
      icon,
      iconPosition = 'start',
      href,
      target,
      htmlType = 'button',
      className,
      style,
      disabled,
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    // 处理 loading 支持 delay
    const isObjLoading =
      typeof loading === 'object' && loading !== null && 'delay' in loading;
    const [delayedLoading, setDelayedLoading] = React.useState(
      Boolean(loading) && !isObjLoading
    );

    React.useEffect(() => {
      if (isObjLoading) {
        const delay = (loading as { delay?: number }).delay ?? 0;
        const timer = setTimeout(() => setDelayedLoading(true), delay);
        return () => clearTimeout(timer);
      } else {
        setDelayedLoading(Boolean(loading));
      }
      return () => {};
    }, [loading]);

    const variant = mapVariant(type, danger);
    const mappedSize = mapSize(size, shape);
    const extraClasses = buildExtraClasses({
      type,
      danger,
      ghost,
      shape,
      block,
    });

    const content = (
      <>
        {delayedLoading && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {!delayedLoading && icon && iconPosition === 'start' && icon}
        {children}
        {!delayedLoading && icon && iconPosition === 'end' && icon}
      </>
    );

    const commonProps: Omit<BaseButtonProps, 'size' | 'variant'> & {
      className?: string;
    } = {
      className: cn('gap-1', extraClasses, className),
      style,
      disabled: disabled || delayedLoading,
      'aria-busy': delayedLoading || undefined,
      onClick,
      ...rest,
    };

    // 支持 href：使用 asChild 包裹 <a>
    if (href) {
      return (
        <BaseButton
          ref={ref as unknown as React.Ref<HTMLButtonElement>}
          asChild
          variant={variant}
          size={mappedSize}
          {...commonProps}
        >
          <a
            href={href}
            target={target}
            rel={target === '_blank' ? 'noreferrer' : undefined}
          >
            {content}
          </a>
        </BaseButton>
      );
    }

    // 普通 button
    return (
      <BaseButton
        ref={ref}
        type={htmlType}
        variant={variant}
        size={mappedSize}
        {...commonProps}
      >
        {content}
      </BaseButton>
    );
  }
);
InternalButton.displayName = 'Button';

// 挂载 Group，保持与 antd Button.Group 类似用法
type EnhancedButtonComponent = typeof InternalButton & {
  Group: typeof ButtonGroup;
};
const Button = InternalButton as EnhancedButtonComponent;
Button.Group = ButtonGroup;

export { Button as EnhancedButton };
export { Button };
