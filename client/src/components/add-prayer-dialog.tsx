import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPrayerEntrySchema, type InsertPrayerEntry } from "@shared/schema";

interface AddPrayerDialogProps {
  category: "unbelievers" | "brethren";
}

export function AddPrayerDialog({ category }: AddPrayerDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<InsertPrayerEntry>({
    resolver: zodResolver(insertPrayerEntrySchema),
    defaultValues: {
      name: "",
      description: "",
      category,
    },
  });

  const addPrayer = useMutation({
    mutationFn: async (data: InsertPrayerEntry) => {
      await apiRequest("POST", "/api/prayers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayers"] });
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Prayer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Prayer</DialogTitle>
          <DialogDescription>
            Add a new prayer request for {category === "unbelievers" ? "an unbeliever" : "a brother/sister in hardship"}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => addPrayer.mutate({ ...data, category }))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Prayer Details</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={addPrayer.isPending}>
              Add Prayer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
