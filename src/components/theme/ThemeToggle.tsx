
import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={theme === 'dark'}
            onPressedChange={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-white/10"
          >
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-white" />
            ) : (
              <Sun className="h-5 w-5 text-white" />
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
