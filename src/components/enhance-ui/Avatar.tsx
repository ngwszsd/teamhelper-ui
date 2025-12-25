import * as React from 'react';
import { cn } from '../../lib/utils';

export interface EnhancedAvatarProps {
  shape?: 'circle' | 'square';
  size?: number | 'small' | 'default' | 'large' | 'xlarge' | '26' | '18';
  icon?: React.ReactNode;
  src?: React.ReactNode;
  srcSet?: string;
  alt?: string;
  draggable?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  className?: string;
  children?: React.ReactNode;
  /**
   * 图片加载失败时回调
   * 返回值为 false 时，阻止默认回退行为（仍尝试显示图片）
   */
  onError?: () => boolean;
  gap?: number;
  autoColor?: boolean;
  initialOnly?: boolean;
}

// 顶层工具函数（与 sizeClasses 同级）
const sizeClasses = {
  small: 'h-6 w-6 text-xs',
  default: 'h-8 w-8 text-sm',
  large: 'h-10 w-10 text-base',
  xlarge: 'h-12 w-12 text-lg',
  '26': 'h-[26px] w-[26px] text-xs',
  '18': 'h-[18px] w-[18px] text-xs',
};

export const Avatar: React.FC<EnhancedAvatarProps> = ({
  shape = 'circle',
  size = 'default',
  icon,
  src,
  srcSet,
  alt,
  draggable = false,
  crossOrigin,
  className,
  children,
  onError,
  gap = 4,
  autoColor = true,
  initialOnly = false,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLSpanElement>(null);
  const [scale, setScale] = React.useState<number>(1);

  const [imgVisible, setImgVisible] = React.useState<boolean>(!!src);

  React.useEffect(() => {
    setImgVisible(!!src);
  }, [src]);

  const measure = React.useCallback(() => {
    const container = containerRef?.current;
    const content = contentRef.current;
    if (!container || !content) {
      setScale(1);
      return;
    }
    const contentWidth = content.scrollWidth;
    const containerWidth = container.clientWidth - gap * 2;

    if (contentWidth === 0 || containerWidth <= 0) {
      setScale(1);
      return;
    }
    const nextScale = containerWidth / contentWidth;
    setScale(nextScale < 1 ? nextScale : 1);
  }, [gap]);

  React.useEffect(() => {
    if (
      imgVisible ||
      (src && React.isValidElement(src)) ||
      (icon && React.isValidElement(icon))
    ) {
      setScale(1);
      return;
    }
    measure();
  }, [imgVisible, src, icon, alt, children, size, measure]);

  React.useEffect(() => {
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => measure());
      if (containerRef.current) ro.observe(containerRef.current);
      return () => ro.disconnect();
    } else {
      const handler = () => measure();
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }
  }, [measure]);

  const isPlainTextNode = (node: React.ReactNode): node is string | number =>
    typeof node === 'string' || typeof node === 'number';

  // 基于实际展示的文本计算颜色种子（考虑 initialOnly）
  const textSeed = React.useMemo(() => {
    if (src && (imgVisible || React.isValidElement(src))) return null;
    if (icon && React.isValidElement(icon)) return null;

    const getInitial = (value: string | number | undefined) => {
      const s = String(value ?? '');
      const ch = s.trim() || '';
      return ch ? ch.toUpperCase() : (alt || '').trim()?.toUpperCase() || '?';
    };

    if (isPlainTextNode(children))
      return initialOnly ? getInitial(children) : String(children);
    if (icon && isPlainTextNode(icon))
      return initialOnly ? getInitial(icon) : String(icon);

    const initial = (alt || '')?.trim?.()?.toUpperCase?.() || '?';
    return initial;
  }, [src, imgVisible, icon, children, alt, initialOnly]);

  const computedColors = React.useMemo(() => {
    if (!autoColor || !textSeed) return null;
    return generateAvatarColor(textSeed);
  }, [autoColor, textSeed]);

  const handleImgError = () => {
    const ret = onError?.();
    if (ret !== false) {
      setImgVisible(false);
    }
  };

  const renderContent = () => {
    if (src) {
      if (React.isValidElement(src)) {
        return src;
      } else if (imgVisible) {
        return (
          <img
            src={String(src || '')}
            srcSet={srcSet}
            alt={alt}
            crossOrigin={crossOrigin}
            draggable={draggable}
            className="h-full w-full object-cover"
            onError={handleImgError}
          />
        );
      }
    }

    if (icon) {
      if (React.isValidElement(icon)) {
        return icon;
      } else {
        children = icon;
      }
    }

    const text = children || String(alt || '') || '';
    const displayText = isPlainTextNode(text)
      ? initialOnly
        ? String(text).trim().charAt(0)?.toUpperCase() || '?'
        : text
      : text;

    return (
      <span
        ref={contentRef}
        className="inline-block whitespace-nowrap leading-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {displayText}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'inline-flex items-center justify-center overflow-hidden select-none align-middle',
        'text-card font-medium',
        src ? 'bg-transparent' : 'bg-foreground/30',
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        size && typeof size === 'number' ? `text-lg ` : 'text-sm',
        size && typeof size === 'string' && sizeClasses[size],
        className
      )}
      style={{
        ...(size && typeof size === 'number'
          ? {
              width: size,
              height: size,
            }
          : {}),
        ...computedColors,
      }}
      title={alt}
    >
      {renderContent()}
    </div>
  );
};

Avatar.displayName = 'EnhancedAvatar';

export type { EnhancedAvatarProps as AvatarProps };

function generateAvatarColor(text: string): {
  backgroundColor: string;
  color: string;
} {
  text = String(text || '').trim();

  // 简单的哈希函数，基于字符串内容生成数值
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }

  // 使用哈希值生成HSL颜色
  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash) % 15); // 45-60%

  return {
    backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`,
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  };
}
