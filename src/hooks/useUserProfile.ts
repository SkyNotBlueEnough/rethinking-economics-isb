import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/trpc/react";

export function useUserProfile() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user profile from our database
  const profileQuery = api.profile.getUserProfile.useQuery();

  // Update user profile mutation
  const updateProfileMutation = api.profile.update.useMutation({
    onSuccess: () => {
      // Invalidate and refetch profile data
      void queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
}
