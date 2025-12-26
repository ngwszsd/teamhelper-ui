import * as React from 'react';
import { cn } from '../../lib/utils';
import { FileX, Inbox, PackageOpen } from 'lucide-react';
import { useLocale } from '../ConfigProvider';

type SemanticName = 'root' | 'image' | 'title' | 'description' | 'footer';

export interface EnhancedEmptyProps {
  image?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: Partial<Record<SemanticName, string | undefined>>;
}

// 预设的空状态图标
const EmptyImages = {
  PRESENTED_IMAGE_DEFAULT: (
    <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full">
      <Inbox className="w-8 h-8 text-muted-foreground" />
    </div>
  ),
  PRESENTED_IMAGE_SIMPLE: (
    <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full">
      <FileX className="w-6 h-6 text-muted-foreground" />
    </div>
  ),
  PRESENTED_IMAGE_OPEN: (
    <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-xl">
      <PackageOpen className="w-6 h-6 text-foreground" />
    </div>
  ),
};

const Empty: React.FC<EnhancedEmptyProps> & {
  PRESENTED_IMAGE_DEFAULT: React.ReactNode;
  PRESENTED_IMAGE_SIMPLE: React.ReactNode;
  PRESENTED_IMAGE_OPEN: React.ReactNode;
} = ({
  image = EmptyImages.PRESENTED_IMAGE_DEFAULT,
  title,
  description,
  footer,
  children,
  classNames,
}) => {
  const locale = useLocale();
  const renderImage = () => {
    if (!image) return null;

    if (React.isValidElement(image)) {
      return image;
    }

    return (
      <div className={cn('flex justify-center', classNames?.image)}>
        <img src={String(image)} alt="empty" />
      </div>
    );
  };

  const renderTitle = () => {
    if (!title) return null;

    return (
      <div
        className={cn(
          'font-medium text-lg text-foreground mt-2',
          classNames?.title
        )}
      >
        {title}
      </div>
    );
  };

  const renderDescription = () => {
    const emptyDescription = description ?? locale.emptyText;

    if (!emptyDescription) return null;

    return (
      <div
        className={cn(
          'text-muted-foreground text-sm mt-2 font-medium',
          classNames?.description
        )}
      >
        {emptyDescription}
      </div>
    );
  };

  const renderfooter = () => {
    if (!footer) return null;

    return <div className={cn('mt-6', classNames?.footer)}>{footer}</div>;
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full',
        classNames?.root
      )}
    >
      {children || (
        <>
          {renderImage()}
          {renderTitle()}
          {renderDescription()}
          {renderfooter()}
        </>
      )}
    </div>
  );
};

// 添加静态属性
Empty.PRESENTED_IMAGE_DEFAULT = EmptyImages.PRESENTED_IMAGE_DEFAULT;
Empty.PRESENTED_IMAGE_SIMPLE = EmptyImages.PRESENTED_IMAGE_SIMPLE;
Empty.PRESENTED_IMAGE_OPEN = EmptyImages.PRESENTED_IMAGE_OPEN;

Empty.displayName = 'EnhancedEmpty';

export { Empty };
