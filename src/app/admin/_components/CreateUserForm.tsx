"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import { Textarea } from "~/components/ui/textarea";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { toast } from "sonner";
import type { CreateProfileInput } from "~/lib/types/admin";

// Form schema for creating a new user profile
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().optional(),
  bio: z.string().optional(),
  isTeamMember: z.boolean().default(false),
  teamRole: z.string().optional(),
  showOnWebsite: z.boolean().default(false),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export interface CreateUserFormProps {
  onSuccess: (newProfile: CreateProfileInput & { id: string }) => void;
  onCancel?: () => void;
  compact?: boolean;
}

export function CreateUserForm({
  onSuccess,
  onCancel,
  compact = false,
}: CreateUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      position: "",
      bio: "",
      isTeamMember: false,
      teamRole: "",
      showOnWebsite: false,
    },
  });

  const createUserMutation = api.admin.createUserProfile.useMutation({
    onSuccess: (data) => {
      toast.success("User profile created successfully");
      form.reset();
      onSuccess(data as CreateProfileInput & { id: string });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user profile");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    setIsSubmitting(true);
    createUserMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter user name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter position (e.g. Researcher)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!compact && (
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter user bio (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div
          className={`flex ${compact ? "flex-col space-y-2" : "flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"}`}
        >
          <FormField
            control={form.control}
            name="isTeamMember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Team Member</FormLabel>
                  {!compact && (
                    <FormDescription>Mark as a team member</FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showOnWebsite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Show on Website</FormLabel>
                  {!compact && (
                    <FormDescription>
                      Display this profile on the website
                    </FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>

        {(form.watch("isTeamMember") || compact) && (
          <FormField
            control={form.control}
            name="teamRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Role</FormLabel>
                <FormControl>
                  <Input placeholder="Team role (if applicable)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoadingSpinner className="mr-2 h-4 w-4 stroke-current" />
            ) : null}
            Create User
          </Button>
        </div>
      </form>
    </Form>
  );
}
