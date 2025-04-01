import React, { useState, useEffect } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Paintbrush, 
  Calendar, 
  PartyPopper, 
  Sparkles,
  Moon,
  Sun,
  Info
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  allThemes,
  seasonalThemes,
  holidayThemes,
  customThemes,
  defaultDarkTheme,
  defaultLightTheme,
  ThemeType
} from "@/lib/theme-options";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [themeCategory, setThemeCategory] = useState<string>("seasonal");
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  
  useEffect(() => {
    // Try to apply saved theme on component mount
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        const foundTheme = allThemes.find(t => t.name === themeData.name);
        if (foundTheme) {
          applyThemeStyles(foundTheme);
          setCurrentTheme(foundTheme.name);
        }
      } catch (e) {
        console.error("Error parsing saved theme:", e);
      }
    }
  }, []);
  
  // Function to apply theme styles to CSS variables
  const applyThemeStyles = (selectedTheme: ThemeType) => {
    document.documentElement.style.setProperty('--primary', selectedTheme.primary);
    document.documentElement.style.setProperty('--background', selectedTheme.background);
    document.documentElement.style.setProperty('--foreground', selectedTheme.text);
    document.documentElement.style.setProperty('--accent', selectedTheme.accent);
  };
  
  // Function to apply a theme
  const applyTheme = (selectedTheme: ThemeType) => {
    // Apply the CSS variables
    applyThemeStyles(selectedTheme);
    
    // Save the selected theme
    localStorage.setItem('site-theme', JSON.stringify({
      name: selectedTheme.name,
      primary: selectedTheme.primary,
      background: selectedTheme.background,
      text: selectedTheme.text,
      accent: selectedTheme.accent,
      variant: selectedTheme.variant
    }));
    
    // Update current theme name
    setCurrentTheme(selectedTheme.name);
    
    // Update the theme.json data
    localStorage.setItem('theme-color', JSON.stringify({
      primary: selectedTheme.primary,
      variant: selectedTheme.variant,
      appearance: theme === 'dark' ? 'dark' : 'light', 
      radius: 0.5
    }));
  };
  
  // Reset to default theme
  const resetToDefault = () => {
    const defaultTheme = theme === 'dark' ? defaultDarkTheme : defaultLightTheme;
    applyTheme(defaultTheme);
    setCurrentTheme("default");
    
    // Clear custom styles
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--background');
    document.documentElement.style.removeProperty('--foreground');
    document.documentElement.style.removeProperty('--accent');
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg-gray-800 hover:bg-gray-700">
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">toggle theme selector</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">theme selector</h4>
            <span className="text-xs text-muted-foreground">
              current: {currentTheme}
            </span>
          </div>
          
          <Tabs defaultValue="seasonal" onValueChange={setThemeCategory}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="seasonal">
                <Calendar className="h-4 w-4 mr-2" />
                seasons
              </TabsTrigger>
              <TabsTrigger value="holiday">
                <PartyPopper className="h-4 w-4 mr-2" />
                holidays
              </TabsTrigger>
              <TabsTrigger value="custom">
                <Sparkles className="h-4 w-4 mr-2" />
                custom
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-72 mt-4">
              <TabsContent value="seasonal" className="space-y-2">
                {seasonalThemes.map((themeOption) => (
                  <ThemeItem 
                    key={themeOption.name} 
                    themeOption={themeOption} 
                    onClick={() => applyTheme(themeOption)}
                    isActive={currentTheme === themeOption.name} 
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="holiday" className="space-y-2">
                {holidayThemes.map((themeOption) => (
                  <ThemeItem 
                    key={themeOption.name} 
                    themeOption={themeOption} 
                    onClick={() => applyTheme(themeOption)}
                    isActive={currentTheme === themeOption.name}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-2">
                {customThemes.map((themeOption) => (
                  <ThemeItem 
                    key={themeOption.name} 
                    themeOption={themeOption} 
                    onClick={() => applyTheme(themeOption)}
                    isActive={currentTheme === themeOption.name}
                  />
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
          
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={resetToDefault}>
              reset to default
            </Button>
            <Button size="sm" variant="default" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? (
                <><Sun className="h-4 w-4 mr-2" /> light mode</>
              ) : (
                <><Moon className="h-4 w-4 mr-2" /> dark mode</>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Individual theme item
function ThemeItem({ 
  themeOption, 
  onClick, 
  isActive 
}: { 
  themeOption: ThemeType; 
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={isActive ? "default" : "outline"}
            className="w-full justify-start text-left font-normal"
            onClick={onClick}
          >
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: themeOption.primary }}
                />
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: themeOption.accent }}
                />
              </div>
              <span>{themeOption.name}</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground flex items-center">
              {themeOption.variant}
              {isActive && <span className="ml-1 text-primary">●</span>}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="text-xs">
            <p>{themeOption.description}</p>
            <div className="mt-1 flex space-x-1">
              <div 
                className="h-3 w-3 rounded-full border border-gray-300" 
                style={{ backgroundColor: themeOption.primary }}
              />
              <div 
                className="h-3 w-3 rounded-full border border-gray-300" 
                style={{ backgroundColor: themeOption.background }}
              />
              <div 
                className="h-3 w-3 rounded-full border border-gray-300" 
                style={{ backgroundColor: themeOption.text }}
              />
              <div 
                className="h-3 w-3 rounded-full border border-gray-300" 
                style={{ backgroundColor: themeOption.accent }}
              />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}