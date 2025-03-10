import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useApi } from "@/hooks/use-api";
import { useQueryClient } from "@tanstack/react-query"; // Added import

const formSchema = z.object({
  name: z.string().min(1, "Prayer name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PrayerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrayerFormDialog({ open, onOpenChange }: PrayerFormDialogProps) {
  const api = useApi();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const queryClient = useQueryClient(); // Added useQueryClient hook

  const onSubmit = async (values: FormValues) => {
    try {
      await api.post("/prayers", values);
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['prayers'] }); // Update UI after successful post
    } catch (error) {
      console.error("Error creating prayer:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Prayer</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prayer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter prayer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter more details about your prayer"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Prayer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}