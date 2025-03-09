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
        "grid grid-cols-2 w-full gap-0",
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
      "flex-1 text-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all",
      "first:rounded-l-md last:rounded-r-md",
      "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-white data-[state=active]:text-foreground",
      "data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground",
      "first:border-r last:border-l border-y border-gray-200",
      "first:border-l last:border-r",
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