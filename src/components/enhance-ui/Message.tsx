import React from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from "lucide-react";

export interface MessageConfig {
  content: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  key?: string | number;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export type MessageType = "success" | "error" | "warning" | "info" | "loading";

class MessageApi {
  private getIcon(type: MessageType) {
    const iconMap = {
      success: <CheckCircle className="w-4 h-4" />,
      error: <XCircle className="w-4 h-4" />,
      warning: <AlertCircle className="w-4 h-4" />,
      info: <Info className="w-4 h-4" />,
      loading: <Loader2 className="w-4 h-4 animate-spin" />,
    };
    return iconMap[type];
  }

  private show(
    type: MessageType,
    content: React.ReactNode | MessageConfig,
    duration?: number,
    onClose?: () => void,
  ) {
    let config: MessageConfig;

    if (
      typeof content === "object" &&
      content !== null &&
      "content" in content
    ) {
      config = content as MessageConfig;
    } else {
      config = {
        content,
        duration,
        onClose,
      };
    }

    const {
      duration: messageDuration = 3,
      onClose: messageOnClose,
      key,
      icon,
      className,
      style,
    } = config;

    const defaultIcon = icon || this.getIcon(type);
    const messageNode = config.content;

    // 关键修复：实际触发 toast，并在关闭时 resolve Promise
    return new Promise<void>((resolve) => {
      const handleDismiss = () => {
        if (messageOnClose) messageOnClose();
        resolve();
      };

      const toastOptions = {
        id: key?.toString(),
        // loading 未显式传 duration 时常驻
        duration:
          type === "loading"
            ? messageDuration
              ? messageDuration * 1000
              : Infinity
            : messageDuration * 1000,
        onDismiss: handleDismiss,
        className,
        style,
        icon: defaultIcon,
      };

      if (type === "success") {
        toast.success(messageNode, toastOptions);
      } else if (type === "error") {
        toast.error(messageNode, toastOptions);
      } else if (type === "loading") {
        toast.loading(messageNode, toastOptions);
      } else {
        // info / warning 使用普通 toast，通过 icon 区分类型
        toast(messageNode, toastOptions);
      }
    });
  }

  success(
    content: React.ReactNode | MessageConfig,
    duration?: number,
    onClose?: () => void,
  ) {
    return this.show("success", content, duration, onClose);
  }

  error(
    content: React.ReactNode | MessageConfig,
    duration?: number,
    onClose?: () => void,
  ) {
    return this.show("error", content, duration, onClose);
  }

  warning(
    content: React.ReactNode | MessageConfig,
    duration?: number,
    onClose?: () => void,
  ) {
    return this.show("warning", content, duration, onClose);
  }

  warn(
    content: React.ReactNode | MessageConfig,
    duration?: number,
    onClose?: () => void,
  ) {
    return this.warning(content, duration, onClose);
  }

  info(
    content: React.ReactNode | MessageConfig,
    duration?: number,
    onClose?: () => void,
  ) {
    return this.show("info", content, duration, onClose);
  }

  loading(
    content: React.ReactNode | MessageConfig,
    duration?: number,
    onClose?: () => void,
  ) {
    return this.show("loading", content, duration, onClose);
  }

  open(config: MessageConfig & { type?: MessageType }) {
    const { type = "info", ...restConfig } = config;
    return this.show(type, restConfig);
  }

  // Destroy all messages
  destroy(key?: string | number) {
    if (key) {
      toast.dismiss(key.toString());
    } else {
      toast.dismiss();
    }
  }
}

// Create a singleton instance
const message = new MessageApi();

export default message;
export { message };
