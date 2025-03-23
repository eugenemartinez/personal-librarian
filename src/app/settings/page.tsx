"use client"

import { useEffect, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "next-themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { DisplaySettings } from "./_components/DisplaySettings";
import { DataManagementSettings } from "./_components/DataManagementSettings";
import { AboutSettings } from "./_components/AboutSettings";
import { useReadingSettings } from "@/contexts/ReadingSettingsContext";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorage";

export const formSchema = z.object({
  // Display settings
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
  
  // Reading settings
  fontSize: z.number().min(14).max(28),
  fontFamily: z.enum(["serif", "sans-serif", "monospace"]),
  lineHeight: z.string(),
  preferredReadingMode: z.enum(["page", "scroll"]),
  
  // Data management settings
  enableReadHistory: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const { theme: currentTheme, setTheme } = useTheme();
  const router = useRouter();
  const { settings, updateSettings } = useReadingSettings();
  
  // Track whether initial load is complete
  const [isLoaded, setIsLoaded] = useState(false);
  // State for active tab with default
  const [activeTab, setActiveTab] = useState<string>("display");
  
  // Create the form with placeholder values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // We'll set these in useEffect after loading from storage
      theme: "system",
      fontSize: 18,
      fontFamily: "serif",
      lineHeight: "1.8",
      preferredReadingMode: "page",
      enableReadHistory: true,
    },
  });

  // Save a setting to localStorage
  const saveSettings = useCallback((key: string, value: any) => {
    try {
      const currentSettings = getLocalStorage<Record<string, any>>("userSettings", {});
      currentSettings[key] = value;
      setLocalStorage("userSettings", currentSettings);
    } catch (error) {
      console.error("Failed to save setting:", error);
    }
  }, []);

  // Load settings once on mount
  useEffect(() => {
    if (isLoaded) {
      return;
    }
    
    try {
      // Load settings using our utility
      const savedSettings = getLocalStorage<Record<string, any>>("userSettings", {});
      
      // Start with default values
      const values: SettingsFormValues = {
        theme: (currentTheme as "light" | "dark" | "system") || "system",
        fontSize: savedSettings.fontSize !== undefined ? savedSettings.fontSize : settings.fontSize,
        fontFamily: savedSettings.fontFamily || settings.fontFamily,
        lineHeight: savedSettings.lineHeight || settings.lineHeight,
        preferredReadingMode: savedSettings.preferredReadingMode || settings.preferredReadingMode,
        enableReadHistory: savedSettings.enableReadHistory !== undefined 
          ? savedSettings.enableReadHistory 
          : true,
      };
      
      // Set form values
      form.reset(values);
      
      // Load active tab
      const determineActiveTab = () => {
        // First, try to get tab from URL hash
        if (typeof window !== 'undefined') {
          const hashTab = window.location.hash.replace('#', '');
          if (hashTab && ['display', 'data', 'about'].includes(hashTab)) {
            return hashTab;
          }
        }
        
        // Then, check localStorage for saved tab
        const savedTab = getLocalStorage<string>("settingsActiveTab", "");
        if (savedTab && ['display', 'data', 'about'].includes(savedTab)) {
          return savedTab;
        }
        
        // Default to 'display'
        return 'display';
      };
      
      const tabToActivate = determineActiveTab();
      setActiveTab(tabToActivate);
      
      // Also update the URL hash if not already set and we're in the browser
      if (typeof window !== 'undefined' && !window.location.hash && tabToActivate) {
        window.history.replaceState(null, '', `#${tabToActivate}`);
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load settings:", error);
      setIsLoaded(true);
    }
  }, [form, currentTheme, settings, isLoaded]);

  // Handle tab change and persist selection
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Save to localStorage
    setLocalStorage("settingsActiveTab", tab);
    
    // Update URL hash
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  // Handle individual field changes
  const handleFieldChange = (field: keyof SettingsFormValues, value: any) => {
    // Update form
    form.setValue(field, value);
    
    // Save to localStorage
    saveSettings(field, value);
    
    // If it's a reading setting, also update context
    if (["fontSize", "fontFamily", "lineHeight", "preferredReadingMode"].includes(field)) {
      const updates: Record<string, any> = { [field]: value };
      updateSettings(updates);
    }
    
    // Special case for theme which needs to be set via the theme provider
    if (field === "theme") {
      setTheme(value);
    }
  };
  
  // Handle navigation back
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 pb-24 lg:pb-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="mb-6 sm:mb-8 flex flex-wrap gap-2">
            <TabsTrigger value="display" className="flex-grow cursor-pointer">Display</TabsTrigger>
            <TabsTrigger value="data" className="flex-grow cursor-pointer">Data</TabsTrigger>
            <TabsTrigger value="about" className="flex-grow cursor-pointer">About</TabsTrigger>
          </TabsList>
          
          {isLoaded ? (
            <Form {...form}>
              <form className="space-y-8">
                <TabsContent value="display">
                  <DisplaySettings 
                    control={form.control}
                    onFieldChange={handleFieldChange}
                  />
                </TabsContent>
                
                <TabsContent value="data">
                  <DataManagementSettings 
                    control={form.control}
                    onFieldChange={handleFieldChange}
                  />
                </TabsContent>
                
                <TabsContent value="about">
                  <AboutSettings />
                </TabsContent>
              </form>
            </Form>
          ) : (
            <div className="py-8 text-center">
              <div className="animate-pulse text-muted-foreground">Loading settings...</div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}