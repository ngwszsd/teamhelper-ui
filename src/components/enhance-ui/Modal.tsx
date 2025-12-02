import React from 'react';
import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '../ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

type SemanticName = 'content' | 'header' | 'body' | 'footer';

export interface ModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  onOkBeforeFunction?: () => boolean | void | Promise<boolean | void>;
  onOk?: () => void | Promise<void>;
  onCancelBeforeFunction?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void | Promise<void>;
  className?: string;
  children?: React.ReactNode;
  closable?: boolean; // 是否显示右上角关闭按钮
  type?: 'primary' | 'danger';
  isShowHeader?: boolean;
  isShowFooter?: boolean;
  classNames?: Partial<Record<SemanticName, string | undefined>>;
  footerBtnPosition?: 'left' | 'center' | 'right' | 'block';
  footerExtraContent?: {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
  };
  isShowCancel?: boolean;
  isShowOk?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  okText,
  cancelText,
  onOkBeforeFunction,
  onOk,
  onCancelBeforeFunction,
  onCancel,
  className,
  children,
  closable = true,
  type = 'primary',
  isShowHeader = true,
  isShowFooter = true,
  classNames,
  footerBtnPosition = 'right',
  footerExtraContent,
  isShowCancel = true,
  isShowOk = true,
}) => {
  const { t } = useTranslation('components');
  const [okLoading, setOkLoading] = React.useState(false);
  const okTextNode = okText ?? t('confirm');
  const cancelTextNode = cancelText ?? t('cancel');

  const runBeforeAndAction = async (
    before?: () => boolean | void | Promise<boolean | void>,
    action?: () => void | Promise<void>
  ) => {
    if (before) {
      const res = await before();
      if (res === false) return false;
    }
    if (action) {
      await action();
    }
    return true;
  };

  const handleOk = async () => {
    if (okLoading) return;
    setOkLoading(true);
    try {
      const proceeded = await runBeforeAndAction(onOkBeforeFunction, onOk);
      if (proceeded) onOpenChange?.(false);
    } catch (e) {
      // 交由上层处理错误即可
    } finally {
      setOkLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const proceeded = await runBeforeAndAction(
        onCancelBeforeFunction,
        onCancel
      );
      if (proceeded) onOpenChange?.(false);
    } catch (e) {
      // 交由上层处理错误即可
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // 当外层关闭（遮罩、ESC、右上角X）时，统一走 cancel 流程
      void handleCancel();
    } else {
      onOpenChange?.(next);
    }
  };

  const renderHeader = () => {
    if (!title) return null;

    if (React.isValidElement(title)) {
      return title;
    }

    return <div>{title}</div>;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          `max-h-[90vh] flex flex-col p-0 `,
          className,
          classNames?.content
        )}
      >
        {isShowHeader ? (
          <DialogTitle
            className={cn(
              'text-xl font-semibold flex justify-between p-5 border-b border-under-line',
              classNames?.header
            )}
          >
            {renderHeader()}

            {closable && (
              <X
                onClick={handleCancel}
                className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-muted-foreground/50"
              />
            )}
          </DialogTitle>
        ) : null}

        <div className={cn('px-5 overflow-y-auto', classNames?.body)}>
          {children}
        </div>

        {isShowFooter ? (
          <DialogFooter
            className={cn(
              'flex-col sm:flex-row gap-2 border-under-line border-t py-5 px-5',
              {
                left: 'sm:justify-start',
                center: 'sm:justify-center',
                block: 'sm:justify-center',
                right: 'sm:justify-end',
              }[footerBtnPosition],
              classNames?.footer
            )}
          >
            {footerExtraContent?.left}
            {isShowCancel ? (
              <Button
                onClick={handleCancel}
                disabled={okLoading}
                className={cn(
                  'min-w-[96px]',
                  type === 'primary' &&
                    'border-primary text-primary hover:text-primary',
                  footerBtnPosition === 'block' && 'flex-1'
                )}
              >
                {cancelTextNode}
              </Button>
            ) : null}

            {footerExtraContent?.center}

            {isShowOk ? (
              <Button
                onClick={handleOk}
                disabled={okLoading}
                className={cn(
                  'min-w-[96px]',
                  footerBtnPosition === 'block' && 'flex-1'
                )}
                danger={type === 'danger'}
                type="primary"
              >
                {okLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {okTextNode}
              </Button>
            ) : null}

            {footerExtraContent?.right}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
