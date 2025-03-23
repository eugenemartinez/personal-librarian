"use client";

import { useState, useRef } from "react";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { SettingsFormValues } from "../formSchema";
import { Upload, Download, AlertTriangle } from "lucide-react";

interface DataManagementSettingsProps {
  control: Control<SettingsFormValues>;
  onFieldChange?: (field: keyof SettingsFormValues, value: any) => void; // Ensure this matches the expected type
}

export function DataManagementSettings({ control, onFieldChange }: DataManagementSettingsProps) {
  const [isResettingLibrary, setIsResettingLibrary] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safe wrapper for calling onFieldChange
  const handleFieldChange = (field: keyof SettingsFormValues, value: any) => {
    if (typeof onFieldChange === "function") {
      onFieldChange(field, value);
    }
  };

  function handleResetLibrary() {
    setIsResettingLibrary(true);
  }

  function confirmResetLibrary() {
    const keysToKeep = ["userSettings", "theme"];
    
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    toast.error("Library Reset", {
      description: "All your library data has been cleared",
    });
    
    setIsResettingLibrary(false);
  }

  // Modify the exportLibraryData function to prevent page refresh
  function exportLibraryData() {
    const libraryData: Record<string, any> = {};
    
    Object.keys(localStorage).forEach(key => {
      if (key !== "theme" && key !== "userSettings") {
        try {
          libraryData[key] = JSON.parse(localStorage.getItem(key) || "null");
        } catch {
          libraryData[key] = localStorage.getItem(key);
        }
      }
    });
    
    const dataStr = JSON.stringify(libraryData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `personal-library-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    // Create link element without appending to DOM
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement); // Append temporarily
    linkElement.click();
    document.body.removeChild(linkElement); // Remove to prevent DOM pollution
    
    toast.success("Export Complete", {
      description: "Your library data has been exported successfully."
    });
  }

  // Function to trigger file input click
  function handleImportClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  // Modify the handleFileImport function to avoid premature refresh
  function handleFileImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate the data (basic check)
        if (typeof data !== 'object' || data === null) {
          throw new Error("Invalid backup format");
        }
        
        // Count of items to import
        const itemCount = Object.keys(data).length;
        if (itemCount === 0) {
          throw new Error("No data found in backup file");
        }
        
        // Use a Dialog or custom confirmation instead of window.confirm
        if (confirm(`This will import ${itemCount} items to your library. Existing data for these items will be overwritten. Continue?`)) {
          // Import each item to localStorage
          let importedCount = 0;
          Object.entries(data).forEach(([key, value]) => {
            if (key !== "theme" && key !== "userSettings") {
              try {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                importedCount++;
              } catch (err) {
                console.error(`Failed to import item: ${key}`, err);
              }
            }
          });
          
          toast.success("Import Complete", {
            description: `Successfully imported ${importedCount} items.`
          });
          
          // Only reload if import was successful and user confirms
          if (importedCount > 0) {
            // Store the current tab in localStorage before reloading
            const activeTab = window.location.hash.replace('#', '') || 'display';
            localStorage.setItem('settingsActiveTab', activeTab);
            
            setTimeout(() => {
              window.location.href = window.location.pathname + '#' + activeTab;
              window.location.reload();
            }, 1500);
          }
        } else {
          // User cancelled
          setIsImporting(false);
        }
      } catch (error) {
        console.error("Import failed:", error);
        toast.error("Import Failed", {
          description: "The selected file is not a valid library backup."
        });
        setIsImporting(false);
      } finally {
        // Reset file input
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      toast.error("Import Failed", {
        description: "Could not read the selected file."
      });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  }

  return (
    <Card className="border border-border">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl text-foreground">Data Management</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Manage your reading history, export data, or reset your library
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6 space-y-6">
        {/* Save Read History */}
        <FormField
          control={control}
          name="enableReadHistory"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 sm:p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm sm:text-base text-foreground">
                  Save Reading History
                </FormLabel>
                <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                  Keep track of books you've read and when you read them
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleFieldChange("enableReadHistory", checked); // Use the safe wrapper
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Separator className="bg-border" />

        {/* Library Backup & Restore */}
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">Library Backup & Restore</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Export or import your library data to transfer between devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={exportLibraryData}
                className="text-sm sm:text-base"
                type="button"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                onClick={handleImportClick}
                className="text-sm sm:text-base"
                disabled={isImporting}
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? "Importing..." : "Import Data"}
              </Button>
              
              {/* Hidden file input */}
              <div className="sr-only">
                <label htmlFor="file-upload">Import library backup file</label>
                <input 
                  type="file" 
                  id="file-upload"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".json"
                  aria-label="Import library backup file"
                  className="hidden" // Use className instead of inline style
                />
              </div>
            </div>
          </div>
          
          <Separator className="bg-border" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">Reset Library</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Delete all your library data. This cannot be undone.
            </p>
            
            {!isResettingLibrary ? (
              <Button
                variant="destructive"
                onClick={handleResetLibrary}
                className="w-full sm:w-auto text-sm sm:text-base"  // Added w-full for mobile, sm:w-auto for tablet+
                type="button"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reset Library
              </Button>
            ) : (
              <div className="bg-destructive/10 p-3 sm:p-4 rounded-lg border border-destructive/30">
                <p className="font-medium text-destructive mb-2 sm:mb-4 text-sm sm:text-base">
                  Are you sure? This will delete all your book data and cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button
                    variant="destructive"
                    onClick={confirmResetLibrary}
                    size="sm"
                    className="w-full sm:w-auto sm:text-base"  // Added w-full for mobile, sm:w-auto for tablet+
                    type="button"
                  >
                    Reset Everything
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsResettingLibrary(false)}
                    size="sm"
                    className="w-full sm:w-auto sm:text-base"  // Added w-full for mobile, sm:w-auto for tablet+
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}