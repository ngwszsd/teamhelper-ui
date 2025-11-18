import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { theme, setTheme } = useTheme();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        {...props}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
);
ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle };
