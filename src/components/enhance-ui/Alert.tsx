import { Info, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";

interface IProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  classNames?: Partial<
    Record<
      "body" | "icon" | "content" | "title" | "description",
      string | undefined
    >
  >;
  showIcon?: boolean;
  type?: "info" | "error" | "warning";
  closable?: boolean;
  closeIcon?: React.ReactNode;
  onClose?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Alert: React.FC<IProps> = ({
  icon,
  title,
  description,
  classNames,
  showIcon = true,
  type = "info",
  closable,
  closeIcon,
  onClose,
}) => {
  const [isShow, setIsShow] = useState(true);
  if (!isShow) return null;

  return (
    <div
      className={cn(
        "px-3 py-1.5 flex items-center space-x-2.5 rounded-[6px]",
        "bg-card border",
        type === "info" && "border-border",
        type === "error" && "border-destructive/50",
        type === "warning" && "border-orange-400/10 bg-orange-400/10",
        classNames?.body,
      )}
    >
      {showIcon
        ? icon || (
            <Info
              className={cn(
                "h-4 w-4",
                type === "info" && "text-foreground",
                type === "error" && "text-destructive",
                type === "warning" && "text-orange-400",
                classNames?.icon,
              )}
            />
          )
        : null}

      <div className={cn("space-y-1 flex-1", classNames?.content)}>
        {title ? (
          <div
            className={cn(
              "text-sm font-medium",
              type === "info" && "text-foreground",
              type === "error" && "text-destructive",
              type === "warning" && "text-orange-400",
              classNames?.title,
            )}
          >
            {title}
          </div>
        ) : null}

        {description ? (
          <div
            className={cn(
              "text-xs",
              type === "info" && "text-muted-foreground",
              type === "error" && "text-destructive",
              type === "warning" && "text-orange-400",
              classNames?.description,
            )}
          >
            {description}
          </div>
        ) : null}
      </div>

      {closable ? (
        <div
          className="w-[22px] h-[22px] flex items-center justify-center cursor-pointer group ml-auto"
          onClick={(e) => {
            setIsShow(false);
            onClose?.(e);
          }}
        >
          {closeIcon || (
            <div className="w-[14px] h-[14px] bg-muted-foreground/60 rounded-full flex items-center justify-center group-hover:bg-muted-foreground">
              <X className="w-[70%] h-[70%] text-primary-foreground" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Alert;
export { Alert as EnhancedAlert };
