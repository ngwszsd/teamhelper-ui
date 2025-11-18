import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import { Button, type EnhancedButtonProps } from "./Button";
import { ChevronDown } from "lucide-react";

export interface DropdownMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  cursorPointer?: boolean;
  divided?: boolean;
  onClick?: (info: { key: string; domEvent: React.MouseEvent }) => void;
  children?: DropdownMenuItem[];
}

export interface EnhancedDropdownProps {
  children: React.ReactNode;
  menu?: {
    items: DropdownMenuItem[];
    onClick?: (info: { key: string; domEvent: React.MouseEvent }) => void;
  };
  trigger?: ("click" | "hover" | "contextMenu")[];
  placement?:
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | "top"
    | "topLeft"
    | "topRight";
  arrow?: boolean | { pointAtCenter?: boolean };
  autoAdjustOverflow?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  destroyPopupOnHide?: boolean;
  dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isSpan?: boolean;
  cursorPointer?: boolean;
}

const Dropdown: React.FC<EnhancedDropdownProps> = ({
  children,
  menu,
  trigger = ["click"],
  placement = "bottomLeft",
  disabled = false,
  overlayClassName,
  overlayStyle,
  open,
  onOpenChange,
  dropdownRender,
  isSpan = true,
  cursorPointer = true,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleMouseEnter = () => {
    if (trigger.includes("hover")) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      handleOpenChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger.includes("hover")) {
      (
        hoverTimeoutRef as React.MutableRefObject<ReturnType<typeof setTimeout> | null>
      ).current = setTimeout(() => {
        handleOpenChange(false);
      }, 100); // 100ms延迟，避免鼠标快速移动时闪烁
    }
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const getSideAndAlign = () => {
    switch (placement) {
      case "top":
        return { side: "top" as const, align: "center" as const };
      case "topLeft":
        return { side: "top" as const, align: "start" as const };
      case "topRight":
        return { side: "top" as const, align: "end" as const };
      case "bottom":
        return { side: "bottom" as const, align: "center" as const };
      case "bottomLeft":
        return { side: "bottom" as const, align: "start" as const };
      case "bottomRight":
        return { side: "bottom" as const, align: "end" as const };
      default:
        return { side: "bottom" as const, align: "start" as const };
    }
  };

  const { side, align } = getSideAndAlign();

  const renderMenuItem = (item: DropdownMenuItem, index: number) => {
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.key}>
          <DropdownMenuSubTrigger
            className={cn(
              "text-xs",
              item.disabled
                ? "opacity-50 cursor-not-allowed"
                : (cursorPointer || item.cursorPointer) && "cursor-pointer",
              item.danger &&
                "text-destructive focus:text-destructive focus:bg-destructive/10",
            )}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.children.map((child, childIndex) =>
              renderMenuItem(child, childIndex),
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <React.Fragment key={item.key}>
        {item.divided && index > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem
          className={cn(
            "text-xs",
            item.disabled
              ? "opacity-50 cursor-not-allowed"
              : (cursorPointer || item.cursorPointer) && "cursor-pointer",
            item.danger &&
              "text-destructive focus:text-destructive focus:bg-destructive/10",
          )}
          disabled={item.disabled}
          onClick={(e) => {
            if (!item.disabled) {
              item.onClick?.({ key: item.key, domEvent: e });
              menu?.onClick?.({ key: item.key, domEvent: e });
            }
          }}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </DropdownMenuItem>
      </React.Fragment>
    );
  };

  const menuContent = menu?.items ? (
    <div className="py-1">
      {menu.items.map((item, index) => renderMenuItem(item, index))}
    </div>
  ) : null;

  const finalContent = dropdownRender
    ? dropdownRender(menuContent)
    : menuContent;

  if (disabled && isSpan) {
    return (
      <span className="cursor-not-allowed opacity-50 h-full">{children}</span>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        className={cn("min-w-[120px]", overlayClassName)}
        style={overlayStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {finalContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Button 组件的下拉按钮封装
interface DropdownButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  buttonProps?: Omit<
    EnhancedButtonProps,
    "className" | "disabled" | "children"
  >;
  dropdownProps?: Omit<EnhancedDropdownProps, "children" | "disabled">;
  disabled?: boolean;
  type?: EnhancedButtonProps["type"];
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  icon,
  onClick,
  className,
  buttonProps,
  dropdownProps,
  disabled,
  type = "primary",
}) => {
  return (
    <div className="flex items-center">
      <Button
        {...buttonProps}
        className={cn("rounded-r-none !px-2", className)}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </Button>

      <Dropdown
        placement="bottomRight"
        isSpan={false}
        {...dropdownProps}
        disabled={disabled}
      >
        <Button
          {...buttonProps}
          htmlType="button"
          className={cn(
            "rounded-l-none -ml-px !px-2",
            type === "primary" &&
              `border-l border-primary-foreground/${!disabled ? 10 : 60}`,
            className,
          )}
          disabled={disabled}
          type={type}
          icon={icon || <ChevronDown className="w-4 h-4" />}
        />
      </Dropdown>
    </div>
  );
};

// 添加静态方法
const DropdownWithStatics = Dropdown as typeof Dropdown & {
  Button: typeof DropdownButton;
};

DropdownWithStatics.Button = DropdownButton;

Dropdown.displayName = "EnhancedDropdown";
DropdownButton.displayName = "EnhancedDropdownButton";

export { DropdownWithStatics as Dropdown, DropdownButton };
