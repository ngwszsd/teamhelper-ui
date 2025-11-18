import * as React from "react";
import { nanoid } from "nanoid";
import { FileIcon, Trash2, Eye } from "lucide-react";
import { cn } from "../../lib/utils";
import { UploadDragger } from "./UploadDragger";

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  status?: UploadStatus;
  percent?: number;
  url?: string;
  response?: any;
  error?: any;
  originFileObj: File;
}

export interface UploadChangeInfo {
  file: UploadFile;
  fileList: UploadFile[];
  event?: ProgressEvent;
}

export interface EnhancedUploadProps {
  // 选择文件
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxCount?: number;

  // 上传相关
  action?: string | ((file: File) => string);
  headers?: Record<string, string>;
  data?: Record<string, any> | ((file: File) => Record<string, any>);
  name?: string; // 上传字段名，默认 "file"
  withCredentials?: boolean;
  customRequest?: (options: {
    file: File;
    onProgress: (e: { percent: number }) => void;
    onSuccess: (response: any) => void;
    onError: (error: any) => void;
    data?: any;
    filename?: string;
    action?: string;
    headers?: any;
    withCredentials?: boolean;
  }) => void;

  // 受控/非受控
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];

  // 事件
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  onChange?: (info: UploadChangeInfo) => void;
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>;
  onPreview?: (file: UploadFile) => void;

  // 展示
  showUploadList?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // 子节点作为触发区域
  children?: React.ReactNode;
}

function toUploadFile(file: File): UploadFile {
  return {
    uid: nanoid(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: undefined,
    percent: 0,
    originFileObj: file,
  };
}

function resolveMaybeFn<T>(
  value: T | ((file: File) => T) | undefined,
  file: File,
): T | undefined {
  if (!value) return undefined;
  return typeof value === "function" ? (value as any)(file) : value;
}

const InternalUpload = ({
  accept,
  multiple = false,
  disabled = false,
  maxCount,
  action,
  headers,
  data,
  name = "file",
  withCredentials,
  customRequest,
  fileList,
  defaultFileList,
  beforeUpload,
  onChange,
  onRemove,
  onPreview,
  showUploadList = true,
  className,
  style,
  children,
}: EnhancedUploadProps) => {
  if (!children) return null;

  const isControlled = !!fileList;
  const [internalList, setInternalList] = React.useState<UploadFile[]>(
    defaultFileList || [],
  );
  const currentList = isControlled ? fileList! : internalList;
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const triggerSelect = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const updateList = (
    next: UploadFile[],
    changedFile?: UploadFile,
    event?: ProgressEvent,
  ) => {
    if (!isControlled) setInternalList(next);
    if (changedFile && onChange) {
      onChange({ file: changedFile, fileList: next, event });
    }
  };

  const doRemove = async (file: UploadFile) => {
    if (onRemove) {
      const res = await onRemove(file);
      if (res === false) return;
    }
    const next = currentList.filter((f) => f.uid !== file.uid);
    updateList(next, file);
  };

  const handlePreview = (file: UploadFile) => {
    if (onPreview) {
      onPreview(file);
      return;
    }
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  const startUpload = async (uf: UploadFile) => {
    const file = uf.originFileObj;
    const url = resolveMaybeFn(action, file);
    const extraData = resolveMaybeFn(data, file);

    const onProgress = (e: { percent: number }) => {
      const nextList = currentList.map((f) =>
        f.uid === uf.uid
          ? { ...f, status: "uploading", percent: e.percent }
          : f,
      );
      const changed = nextList.find((f) => f.uid === uf.uid)!;
      updateList(nextList as UploadFile[], changed as UploadFile);
    };

    const onSuccess = (response: any) => {
      const nextList = currentList.map((f) =>
        f.uid === uf.uid ? { ...f, status: "done", percent: 100, response } : f,
      );
      const changed = nextList.find((f) => f.uid === uf.uid)!;
      updateList(nextList as UploadFile[], changed as UploadFile);
    };

    const onError = (error: any) => {
      const nextList = currentList.map((f) =>
        f.uid === uf.uid ? { ...f, status: "error", error } : f,
      );
      const changed = nextList.find((f) => f.uid === uf.uid)!;
      updateList(nextList as UploadFile[], changed as UploadFile);
    };

    // 未提供上传方式则直接标记为 done
    if (!customRequest && !url) {
      const nextList = currentList.map((f) =>
        f.uid === uf.uid ? { ...f, status: "done", percent: 100 } : f,
      );
      const changed = nextList.find((f) => f.uid === uf.uid)!;
      updateList(nextList as UploadFile[], changed as UploadFile);
      return;
    }

    if (customRequest) {
      customRequest({
        file,
        onProgress,
        onSuccess,
        onError,
        data: extraData,
        filename: name,
        action: url,
        headers,
        withCredentials,
      });
      return;
    }

    // 使用项目封装的上传方法（支持进度）
    const form = new FormData();
    form.append(name, file);
    if (extraData) {
      Object.entries(extraData).forEach(([k, v]) => form.append(k, String(v)));
    }

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (evt) => {
        const total = evt.total || 1;
        const percent = Math.min(
          100,
          Math.round(((evt.loaded || 0) / total) * 100),
        );
        onProgress({ percent });
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onSuccess(undefined);
        } else {
          onError(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        onError(new Error('Upload failed'));
      });

      xhr.open('POST', url!);

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, String(value));
        });
      }

      if (withCredentials) {
        xhr.withCredentials = true;
      }

      xhr.send(form);
    } catch (err) {
      onError(err);
    }
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    // 数量限制
    const sliced =
      maxCount && files.length + currentList.length > maxCount
        ? files.slice(0, Math.max(0, maxCount - currentList.length))
        : files;

    // beforeUpload 校验
    const passList: File[] = [];
    for (const f of sliced) {
      let pass = true;
      if (beforeUpload) {
        // eslint-disable-next-line no-await-in-loop
        const res = await beforeUpload(f, sliced);
        pass = res !== false;
      }
      if (pass) passList.push(f);
    }
    if (!passList.length) return;

    // 添加到列表并启动上传
    const toAdd = passList.map(toUploadFile);
    const nextList = multiple ? [...currentList, ...toAdd] : [...toAdd];
    updateList(nextList, toAdd[toAdd.length - 1]);

    // 启动上传（逐个）
    for (const uf of toAdd) {
      // eslint-disable-next-line no-await-in-loop
      await startUpload(uf);
    }
  };

  return (
    <div className={cn("space-y-2 flex flex-col", className)} style={style}>
      {/* 触发区域：与 antd 一致，children 为点击触发 */}
      <div
        role="button"
        tabIndex={0}
        onClick={triggerSelect}
        onKeyDown={(e) => (e.key === "Enter" ? triggerSelect() : undefined)}
        className={cn(
          "inline-flex items-center gap-2 cursor-pointer select-none",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {children}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onInputChange}
        />
      </div>

      {/* 文件列表 */}
      {showUploadList && currentList.length > 0 && (
        <div className="space-y-2">
          {currentList.map((file) => (
            <div
              key={file.uid}
              className="flex items-center justify-between rounded border bg-background px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[20rem]">{file.name}</span>
                {typeof file.size === "number" && (
                  <span className="text-muted-foreground">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                )}
                {file.status === "uploading" && (
                  <span className="text-muted-foreground">
                    - {file.percent ?? 0}%
                  </span>
                )}
                {file.status === "error" && (
                  <span className="text-destructive">- 上传失败</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-primary cursor-pointer"
                  onClick={() => handlePreview(file)}
                  disabled={!file.url && !onPreview}
                >
                  <Eye className="size-4" />
                  预览
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                  onClick={() => doRemove(file)}
                >
                  <Trash2 className="size-4" />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

InternalUpload.displayName = "Upload";

// 绑定 Dragger：与 antd 保持一致
type UploadComponent = typeof InternalUpload & {
  Dragger: typeof UploadDragger;
};
const Upload = InternalUpload as UploadComponent;
Upload.Dragger = UploadDragger;

export { Upload };
