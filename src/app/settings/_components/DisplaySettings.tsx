import { Control } from "react-hook-form";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { SettingsFormValues } from "../page";

interface DisplaySettingsProps {
  control: Control<SettingsFormValues>;
  onFieldChange?: (field: keyof SettingsFormValues, value: any) => void;
}

export function DisplaySettings({ control, onFieldChange }: DisplaySettingsProps) {
  // Create a safe function to call onFieldChange
  const handleFieldChange = (field: keyof SettingsFormValues, value: any) => {
    // Only call if the function exists
    if (typeof onFieldChange === 'function') {
      onFieldChange(field, value);
    }
  };

  return (
    <Card className="w-full overflow-hidden border border-border">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl text-foreground">Display Settings</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Customize how the app looks and your reading experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-6">
        {/* Theme Selection */}
        <FormField
          control={control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Theme</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleFieldChange("theme", value);
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full sm:w-[240px] cursor-pointer">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="light">Light</SelectItem>
                  <SelectItem className="cursor-pointer" value="dark">Dark</SelectItem>
                  <SelectItem className="cursor-pointer" value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                Choose the application theme.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Font Size */}
        <FormField
          control={control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Font Size</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 px-1">
                    <span className="text-xs text-muted-foreground">A</span>
                    <Slider 
                      min={14}
                      max={28}
                      step={1}
                      value={[field.value]}
                      onValueChange={(values) => {
                        field.onChange(values[0]);
                        handleFieldChange("fontSize", values[0]);
                      }}
                      className="w-full max-w-xs flex-1 cursor-pointer"
                    />
                    <span className="text-lg text-muted-foreground">A</span>
                  </div>
                  <div className="text-center text-xs text-muted-foreground">
                    {field.value}px
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                Set your preferred font size for reading books.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Font Family */}
        <FormField
          control={control}
          name="fontFamily"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Font Family</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleFieldChange("fontFamily", value);
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full sm:w-[240px] cursor-pointer">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="serif">Serif</SelectItem>
                  <SelectItem className="cursor-pointer" value="sans-serif">Sans Serif</SelectItem>
                  <SelectItem className="cursor-pointer" value="monospace">Monospace</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                Choose your preferred font style for reading.
              </FormDescription>
            </FormItem>
          )}
        />
        
        {/* Line Height */}
        <FormField
          control={control}
          name="lineHeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Line Spacing</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleFieldChange("lineHeight", value);
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full sm:w-[240px] cursor-pointer">
                    <SelectValue placeholder="Select line spacing" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="1.5">Compact</SelectItem>
                  <SelectItem className="cursor-pointer" value="1.8">Normal</SelectItem>
                  <SelectItem className="cursor-pointer" value="2.2">Relaxed</SelectItem>
                  <SelectItem className="cursor-pointer" value="2.5">Spacious</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                Choose your preferred line spacing for reading.
              </FormDescription>
            </FormItem>
          )}
        />
        
        {/* Reading Mode */}
        <FormField
          control={control}
          name="preferredReadingMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Reading Mode</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleFieldChange("preferredReadingMode", value);
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full sm:w-[240px] cursor-pointer">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="page">Page Mode</SelectItem>
                  <SelectItem value="scroll" className="flex items-center gap-2 cursor-pointer">
                    <span>Scroll Mode</span>
                    <Badge variant="outline" className="ml-1 text-xs font-normal bg-yellow-100/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900">
                      Beta
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                {field.value === 'page' 
                  ? 'Traditional page-by-page reading experience.' 
                  : 'Continuous scrolling experience (beta).'}
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}