
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ResponsiveTabs = TabsPrimitive.Root;

const ResponsiveTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();
  
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "grid w-full border-b grid-cols-2",
        isMobile ? "overflow-x-auto scrollbar-hide" : "",
        className
      )}
      {...props}
    />
  );
});
ResponsiveTabsList.displayName = "ResponsiveTabsList";

const ResponsiveTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-all flex-1",
      "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:border-primary data-[state=active]:text-foreground",
      className
    )}
    {...props}
  />
));
ResponsiveTabsTrigger.displayName = "ResponsiveTabsTrigger";

const ResponsiveTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
));
ResponsiveTabsContent.displayName = "ResponsiveTabsContent";

export {
  ResponsiveTabs,
  ResponsiveTabsList,
  ResponsiveTabsTrigger,
  ResponsiveTabsContent,
};
