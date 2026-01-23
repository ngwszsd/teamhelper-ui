import * as React from 'react';
import { FileIcon, Trash2, CircleX, FolderUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useLocale } from '../ConfigProvider';
import { type Ref, useImperativeHandle } from 'react';
export type ParseMode = 'json' | 'text' | 'arrayBuffer' | 'none';
export type ListType = 'list' | 'card';

export type UploadDraggerRef = {
  emitTriggerSelect: () => void;
};

export interface UploadDraggerProps {
  accept?: string; // e.g. ".json,application/json"
  multiple?: boolean;
  maxSize?: number; // bytes，超出提示错误
  disabled?: boolean;
  parseAs?: ParseMode;
  listType?: ListType; // 新增：列表类型
  onChange?: (files: File[]) => void;
  onParsed?: (data: unknown, file: File) => void;
  onError?: (msg: string) => void;
  className?: string;
  children?: React.ReactNode; // 自定义内层内容
  description?: React.ReactNode; // 默认提示文案
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  // 新增：文件列表控制
  showFileList?: boolean;
  fileList?: File[];
  onFileListChange?: (files: File[]) => void;
  renderFileItem?: (
    file: File,
    index: number,
    onRemove: () => void
  ) => React.ReactNode;
  ref?: Ref<UploadDraggerRef>;
  isCustomClick?: boolean;
}

/**
 * UploadDragger 可复用上传组件（拖拽 + 点击）
 * - 默认样式为虚线边框拖拽区域，点击区域可触发文件选择
 * - 通过 props 配置解析与校验
 */
export function UploadDragger({
  accept = '',
  multiple = true,
  maxSize,
  disabled = false,
  parseAs = 'none',
  listType = 'list', // 默认为list模式
  onChange,
  onParsed,
  onError,
  className,
  children,
  description,
  inputProps,
  showFileList = true,
  fileList,
  onFileListChange,
  renderFileItem,
  ref,
  isCustomClick = false,
}: UploadDraggerProps) {
  const locale = useLocale();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = React.useState(false);

  // 根据listType决定是否显示文件列表
  const shouldShowFileList = listType === 'list' ? showFileList : false;
  const acceptTokens = React.useMemo(
    () =>
      accept
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [accept]
  );
  // 非受控列表
  const [internalFiles, setInternalFiles] = React.useState<File[]>([]);
  const isControlled = fileList !== undefined;
  const currentFiles = isControlled ? fileList! : internalFiles;

  useImperativeHandle(ref, () => {
    return {
      emitTriggerSelect() {
        triggerSelect();
      },
    };
  }, []);

  const matchAccept = (file: File) => {
    if (!acceptTokens?.length) return true;
    return acceptTokens.some((t) => {
      if (t.startsWith('.')) {
        return file.name.toLowerCase().endsWith(t.toLowerCase());
      }
      if (t.endsWith('/*')) {
        const base = t.slice(0, -2);
        return file.type.startsWith(base);
      }
      return file.type === t;
    });
  };

  const validateFiles = (files: File[]) => {
    const valid: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (maxSize && file.size > maxSize) {
        errors.push(locale.error_size.replace('{{fileName}}', file.name));
        return;
      }
      if (!matchAccept(file)) {
        errors.push(locale.error_type.replace('{{fileName}}', file.name));
        return;
      }
      valid.push(file);
    });

    if (errors.length) {
      const sep = locale?.removeFile ? '；' : '; '; // Simple check for CJK
      const msg = errors.join(sep);
      onError?.(msg);
      toast.error(msg);
    }
    return valid;
  };

  const parseFile = async (file: File) => {
    try {
      if (parseAs === 'json') {
        const text = await file.text();
        const data = JSON.parse(text);
        onParsed?.(data, file);
      } else if (parseAs === 'text') {
        const text = await file.text();
        onParsed?.(text, file);
      } else if (parseAs === 'arrayBuffer') {
        const buf = await file.arrayBuffer();
        onParsed?.(buf, file);
      }
    } catch (e) {
      const msg = locale.error_parse.replace('{{fileName}}', file.name);
      onError?.(msg);
      toast.error(msg);
    }
  };

  const updateFileList = (next: File[]) => {
    if (isControlled) {
      onFileListChange?.(next);
    } else {
      setInternalFiles(next);
    }
  };

  const handleFiles = async (files: File[]) => {
    const valid = validateFiles(files);
    if (!valid.length) return;
    onChange?.(valid);

    // 累加或替换
    const nextList = multiple ? [...currentFiles, ...valid] : [...valid];
    updateFileList(nextList);

    if (parseAs !== 'none') {
      for (const f of valid) {
        // 顺序解析，避免并发 toast 混乱
        // 可按需改成 Promise.all
        // eslint-disable-next-line no-await-in-loop
        await parseFile(f);
      }
    }
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
    // 清空 input，避免选择相同文件后无法触发 change
    e.target.value = '';
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files || []);
    await handleFiles(files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const triggerSelect = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  const removeAt = (index: number) => {
    const next = currentFiles.filter((_, i) => i !== index);
    updateFileList(next);
  };

  const clearAll = () => {
    updateFileList([]);
    onChange?.([]);
  };

  // 检查是否有图片文件用于card模式预览
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    let url: string | null = null;
    const firstFile = currentFiles.length > 0 ? currentFiles[0] : null;
    const hasImage = !!(
      firstFile &&
      firstFile.type &&
      firstFile.type.startsWith('image/')
    );

    if (hasImage && firstFile) {
      url = URL.createObjectURL(firstFile);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [currentFiles]);

  const descriptionNode = description ?? locale.dragDescription;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (isCustomClick) return;

          triggerSelect();
        }}
        onKeyDown={(e) => (e.key === 'Enter' ? triggerSelect() : undefined)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-md border-2 border-dashed text-center select-none cursor-pointer',
          listType === 'card' ? 'p-0 overflow-hidden' : '',
          disabled && 'opacity-50 cursor-not-allowed',
          dragging
            ? 'border-primary/80 bg-primary/5'
            : 'border-border hover:bg-background',
          className
        )}
      >
        {listType === 'card' &&
        (imagePreviewUrl || (currentFiles[0] as any)?.url) ? (
          // Card模式：显示图片预览
          <>
            <img
              src={imagePreviewUrl || (currentFiles[0] as any)?.url}
              alt={locale.preview || 'Preview'}
              className="object-cover w-full h-full"
            />
            {/* 右上角清除按钮 */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="absolute top-2 right-2 rounded-full flex items-center justify-center  transition-colors cursor-pointer"
            >
              <CircleX className="w-4 h-4" color="var(--destructive)" />
            </div>
          </>
        ) : (
          // 默认模式或无图片时：显示上传区域
          <>
            {children ?? (
              <div className="flex flex-col items-center gap-4 p-8 min-h-40">
                <FolderUp className="w-10 h-auto shrink-0 text-primary" />

                <div className="text-sm text-muted-foreground font-medium">
                  {descriptionNode}
                </div>
              </div>
            )}
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onInputChange}
          {...inputProps}
        />
      </div>

      {shouldShowFileList && currentFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {currentFiles.map((file, idx) =>
            renderFileItem ? (
              renderFileItem(file, idx, () => removeAt(idx))
            ) : (
              <div
                key={`${file.name}-${file.size}-${idx}`}
                className="flex items-center justify-between rounded border bg-background px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileIcon className="size-4 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[20rem]">{file.name}</span>
                  <span className="text-muted-foreground">
                    ({formatSize(file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                  onClick={() => removeAt(idx)}
                >
                  <Trash2 className="size-4" />
                  {locale.removeFile}
                </button>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}

export default UploadDragger;
