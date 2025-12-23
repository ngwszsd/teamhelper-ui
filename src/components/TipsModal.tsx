import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import type { NiceModalHocProps } from '@ebay/nice-modal-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from './ui/dialog';
import { Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './enhance-ui/Button';

type SemanticName = 'content' | 'header' | 'body' | 'footer';

export interface TipsModalProps extends Omit<NiceModalHocProps, 'id'> {
  /**
   * 提示信息 - 支持ReactNode或字符串
   */
  content?: React.ReactNode;

  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 确定按钮文本
   */
  okText?: string | null;
  /**
   * 取消按钮文本
   */
  cancelText?: string | null;

  /**
   * 弹窗确定之前，返回false不关闭弹框
   */
  onOkBeforeFunction?: () => boolean | Promise<boolean | undefined>;

  /**
   * 确定按钮回调
   */
  onOk?: (e?: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * 弹窗取消按钮之前，返回false不关闭弹框
   */
  onCancelBeforeFunction?: () => boolean | Promise<boolean | undefined>;
  /**
   * 取消按钮
   */
  onCancel?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string; // DialogContent 类名
  type?: 'primary' | 'danger';
  isShowHeader?: boolean;
  isShowFooter?: boolean;
  classNames?: Partial<Record<SemanticName, string | undefined>>;
  footerBtnPosition?: 'left' | 'center' | 'right' | 'block';
  /**
   * 倒计时时长（秒）
   */
  countdown?: number;
}

const TipsModal: FC<TipsModalProps> = ({
  content,
  onOkBeforeFunction,
  onCancel,
  onCancelBeforeFunction,
  onOk: onConfirm,
  title,
  okText,
  cancelText,
  className = '',
  type = 'primary',
  isShowHeader = true,
  isShowFooter = true,
  classNames,
  footerBtnPosition = 'right',
  countdown = 0,
}) => {
  const { t } = useTranslation('components');
  const modal = useModal();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(countdown);

  useEffect(() => {
    setRemainingTime(countdown);
  }, [countdown, setRemainingTime]);

  useEffect(() => {
    let timer = null;
    if (modal?.visible) {
      if (remainingTime > 0) {
        timer = setTimeout(() => {
          setRemainingTime((prev) => prev - 1);
        }, 1000);
      }
    } else {
      timer && clearTimeout(timer);
      setRemainingTime(countdown);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [remainingTime, setRemainingTime, modal.visible]);

  const titleText = title ?? t('tips.title');
  const okTextText = okText === null ? null : (okText ?? t('confirm'));
  const cancelTextText =
    cancelText === null ? null : (cancelText ?? t('cancel'));

  const onOk = async () => {
    setConfirmLoading(true);
    try {
      if (onOkBeforeFunction) {
        const result = await onOkBeforeFunction();
        if (result === false) {
          setConfirmLoading(false);
          return;
        }
      }
      onConfirm?.();
      modal.resolve(true);
      modal.hide();
    } catch (error) {
      console.error('TipsModal onOk error:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 渲染提示内容
  const renderContent = () => {
    // 优先使用新的content属性
    if (content) {
      return content;
    }
    return null;
  };

  /**
   * 取消关闭弹窗
   * 返回值 false
   */
  const onCancelModal = async () => {
    if (onCancelBeforeFunction) {
      const result = await onCancelBeforeFunction();
      if (result === false) {
        return;
      }
    }
    onCancel?.();
    modal.resolve(false);
    modal.hide();
  };

  const renderHeader = () => {
    if (!titleText) return null;

    if (React.isValidElement(titleText)) {
      return titleText;
    }

    return <div>{titleText}</div>;
  };

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(open) => {
        if (!open) {
          onCancelModal();
        }
      }}
    >
      <DialogContent
        className={cn(
          `max-h-[90vh] flex flex-col`,
          'min-w-[400px] w-auto p-0 gap-0',
          className,
          classNames?.content
        )}
      >
        {isShowHeader ? (
          <DialogTitle
            className={cn(
              'text-[20px] font-medium flex justify-between p-5  border-border border-b',
              classNames?.header
            )}
          >
            {renderHeader()}

            <X
              onClick={onCancelModal}
              className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-muted-foreground/50"
            />
          </DialogTitle>
        ) : null}

        <div
          style={{ width: 'auto', fontSize: '14px', color: '#4E5969' }}
          className={cn('p-5 overflow-y-auto', classNames?.body)}
        >
          {renderContent()}
        </div>

        {isShowFooter ? (
          <DialogFooter
            className={cn(
              'w-full flex justify-end p-5',
              {
                left: 'sm:justify-start',
                center: 'sm:justify-center',
                block: 'sm:justify-center',
                right: 'sm:justify-end',
              }[footerBtnPosition],
              classNames?.footer
            )}
          >
            {cancelTextText && (
              <Button
                className={cn(
                  'min-w-[96px]',
                  footerBtnPosition === 'block' && 'flex-1'
                )}
                onClick={onCancelModal}
              >
                {cancelTextText}
              </Button>
            )}
            {okTextText && (
              <Button
                className={cn(
                  'min-w-[96px]',
                  footerBtnPosition === 'block' && 'flex-1'
                )}
                onClick={onOk}
                disabled={confirmLoading || remainingTime > 0}
                danger={type === 'danger'}
                type="primary"
              >
                {confirmLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {okTextText}
                {remainingTime > 0 && ` (${remainingTime}s)`}
              </Button>
            )}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

/**
 * 打开提示弹窗的便捷函数
 */
// 创建TipsModal组件
const TipsModalComponent = NiceModal.create(TipsModal);

/**
 * 打开提示弹窗
 * @param content 提示内容 - 支持ReactNode或字符串
 * @param options 其他选项
 */
export const openTipsModal = (
  content: React.ReactNode,
  options?: Omit<TipsModalProps, 'content'>
): Promise<boolean> => {
  return NiceModal.show(TipsModalComponent, {
    content,
    ...options,
  });
};

export const openModalWarning = ({
  showIcon = true,
  icon,
  classNames,
  title,
  description,
  options,
  onOk,
  onOkBeforeFunction,
}: {
  showIcon?: boolean;
  icon?: React.ReactNode;
  classNames?: Partial<Record<'box' | 'icon' | 'content', string | undefined>>;
  title?: TipsModalProps['title'];
  description?: React.ReactNode;
  options?: Omit<TipsModalProps, 'title' | 'content'>;
  onOk?: TipsModalProps['onOk'];
  onOkBeforeFunction?: TipsModalProps['onOkBeforeFunction'];
}) => {
  const renderTitle = () => {
    if (!title) return null;

    if (React.isValidElement(title)) {
      return title;
    }

    return <div className="text-foreground text-base font-medium">{title}</div>;
  };

  const renderDescription = () => {
    if (!description) return null;

    if (React.isValidElement(description)) {
      return description;
    }

    return (
      <div className="text-muted-foreground text-sm text-center">
        {description}
      </div>
    );
  };

  return openTipsModal(
    <div
      className={cn('gap-[22px] flex flex-col items-center', classNames?.box)}
    >
      {showIcon
        ? icon || (
            <div
              className={cn(
                'w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center overflow-hidden',
                'text-muted text-4xl font-medium',
                classNames?.icon
              )}
            >
              !
            </div>
          )
        : null}
      <div
        className={cn('flex flex-col items-center gap-2', classNames?.content)}
      >
        {renderTitle()}
        {renderDescription()}
      </div>
    </div>,
    {
      onOk,
      onOkBeforeFunction,
      classNames: {
        content: 'min-w-auto max-w-full w-[394px]',
      },
      isShowHeader: false,
      ...options,
    }
  );
};

export const openModalError = ({
  showIcon = true,
  icon,
  classNames,
  title,
  content,
  options,
  onOk,
  onOkBeforeFunction,
}: {
  showIcon?: boolean;
  icon?: React.ReactNode;
  classNames?: Partial<Record<'box' | 'icon' | 'content', string | undefined>>;
  title?: TipsModalProps['title'];
  content: React.ReactNode;
  options?: Omit<TipsModalProps, 'title' | 'content' | 'onOk'>;
  onOk?: TipsModalProps['onOk'];
  onOkBeforeFunction?: TipsModalProps['onOkBeforeFunction'];
}) => {
  return openTipsModal(
    <div className={cn('gap-3 flex', classNames?.box)}>
      {showIcon
        ? icon || (
            <div
              className={cn(
                'w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center overflow-hidden',
                'text-muted text-[22px] font-medium',
                classNames?.icon
              )}
            >
              !
            </div>
          )
        : null}
      <div
        className={cn(
          'text-base text-muted-foreground flex-1',
          classNames?.content
        )}
      >
        {content}
      </div>
    </div>,
    {
      title,
      type: 'danger',
      onOkBeforeFunction,
      classNames: {
        content: 'min-w-auto max-w-full w-[474px]',
      },
      onOk(e) {
        onOk?.(e);
      },
      ...options,
    }
  );
};

export const openModalWarning02 = ({
  showIcon = true,
  icon,
  classNames,
  title,
  content,
  options,
  onOk,
  onOkBeforeFunction,
}: {
  showIcon?: boolean;
  icon?: React.ReactNode;
  classNames?: Partial<Record<'box' | 'icon' | 'content', string | undefined>>;
  title?: TipsModalProps['title'];
  content: React.ReactNode;
  options?: Omit<TipsModalProps, 'title' | 'content' | 'onOk'>;
  onOk?: TipsModalProps['onOk'];
  onOkBeforeFunction?: TipsModalProps['onOkBeforeFunction'];
}) => {
  return openModalError({
    showIcon,
    icon,
    classNames,
    title,
    content,
    options: {
      type: 'primary',
      ...options,
    },
    onOk,
    onOkBeforeFunction,
  });
};

export default TipsModalComponent;
