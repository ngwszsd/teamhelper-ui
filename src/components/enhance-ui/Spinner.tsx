import * as React from "react";
import { cn } from "../../lib/utils";

export interface EnhancedSpinnerProps {
  spinning?: boolean;
  size?: "small" | "default" | "large";
  tip?: React.ReactNode;
  delay?: number;
  indicator?: React.ReactNode;
  wrapperClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Spinner: React.FC<EnhancedSpinnerProps> = ({
  spinning = true,
  size = "default",
  tip,
  delay = 0,
  indicator,
  wrapperClassName,
  className,
  style,
  children,
}) => {
  const [isSpinning, setIsSpinning] = React.useState(
    delay === 0 ? spinning : false,
  );

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsSpinning(spinning);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsSpinning(spinning);
    }
    return () => {};
  }, [spinning, delay]);

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-8 w-8";
      default:
        return "h-6 w-6";
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const defaultIndicator = (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
        getSizeClass(),
      )}
    />
  );

  const spinnerElement = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
      style={style}
    >
      {indicator || defaultIndicator}
      {tip && (
        <div className={cn("text-muted-foreground", getTextSizeClass())}>
          {tip}
        </div>
      )}
    </div>
  );

  if (children) {
    return (
      <div className={cn("relative", wrapperClassName)}>
        <div
          className={cn(
            "transition-opacity duration-200",
            isSpinning && "opacity-50 pointer-events-none",
          )}
        >
          {children}
        </div>
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            {spinnerElement}
          </div>
        )}
      </div>
    );
  }

  if (!isSpinning) {
    return null;
  }

  return spinnerElement;
};

// 静态方法支持
interface SpinnerStaticMethods {
  setDefaultIndicator: (indicator: React.ComponentType) => void;
}

const SpinnerWithStatics = Spinner as typeof Spinner & SpinnerStaticMethods;

Spinner.displayName = "EnhancedSpinner";

export { SpinnerWithStatics as EnhancedSpinner };
