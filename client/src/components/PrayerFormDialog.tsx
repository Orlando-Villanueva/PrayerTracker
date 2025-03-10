import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/use-api";

const PRAYERS_QUERY_KEY = "/api/prayers";

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
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const addPrayer = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.post("/prayers", data);
      return response.data;
    },
    onMutate: async (newPrayer) => {
      await queryClient.cancelQueries({ queryKey: [PRAYERS_QUERY_KEY] });
      const previousPrayers = queryClient.getQueryData([PRAYERS_QUERY_KEY]);

      queryClient.setQueryData([PRAYERS_QUERY_KEY], (old: any[] = []) => [
        ...old,
        { id: Date.now(), ...newPrayer, answered: false },
      ]);

      return { previousPrayers };
    },
    onError: (err, newPrayer, context) => {
      queryClient.setQueryData([PRAYERS_QUERY_KEY], context?.previousPrayers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PRAYERS_QUERY_KEY] });
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    addPrayer.mutate(values);
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
                      value={field.value || ''}
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
              <Button 
                type="submit" 
                disabled={addPrayer.isPending}
              >
                Add Prayer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}