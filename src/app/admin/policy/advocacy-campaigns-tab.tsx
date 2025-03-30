"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Edit, Plus, Trash2, Target, ListChecks } from "lucide-react";
import type {
  AdvocacyCampaign,
  AdvocacyCampaignStatus,
} from "~/lib/types/policy";

// Form schema for advocacy campaign
const campaignFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "completed", "planned"]),
  imageUrl: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  displayOrder: z.number().default(0),
});

export default function AdvocacyCampaignsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<AdvocacyCampaign | null>(null);
  const [achievementInput, setAchievementInput] = useState("");

  // Fetch data from API
  const {
    data: campaigns,
    isLoading,
    refetch: refetchCampaigns,
  } = api.policy.getAllAdvocacyCampaigns.useQuery();

  // Mutations
  const createCampaign = api.policy.createAdvocacyCampaign.useMutation({
    onSuccess: () => {
      toast.success("Advocacy campaign created successfully");
      refetchCampaigns();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error creating advocacy campaign: ${error.message}`);
    },
  });

  const updateCampaign = api.policy.updateAdvocacyCampaign.useMutation({
    onSuccess: () => {
      toast.success("Advocacy campaign updated successfully");
      refetchCampaigns();
      setIsDialogOpen(false);
      setEditingCampaign(null);
    },
    onError: (error) => {
      toast.error(`Error updating advocacy campaign: ${error.message}`);
    },
  });

  const deleteCampaign = api.policy.deleteAdvocacyCampaign.useMutation({
    onSuccess: () => {
      toast.success("Advocacy campaign deleted successfully");
      refetchCampaigns();
    },
    onError: (error) => {
      toast.error(`Error deleting advocacy campaign: ${error.message}`);
    },
  });

  // Campaign form
  const campaignForm = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planned",
      imageUrl: "",
      achievements: [],
      displayOrder: 0,
    },
  });

  const { watch, setValue } = campaignForm;
  const watchedAchievements = watch("achievements");

  const addAchievement = () => {
    if (achievementInput.trim() === "") return;

    const currentAchievements = campaignForm.getValues("achievements") || [];
    setValue("achievements", [...currentAchievements, achievementInput.trim()]);
    setAchievementInput("");
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = [...watchedAchievements];
    currentAchievements.splice(index, 1);
    setValue("achievements", currentAchievements);
  };

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    campaignForm.reset({
      title: "",
      description: "",
      status: "planned",
      imageUrl: "",
      achievements: [],
      displayOrder: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditCampaign = (campaign: AdvocacyCampaign) => {
    setEditingCampaign(campaign);
    campaignForm.reset({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description || "",
      status: campaign.status as AdvocacyCampaignStatus,
      imageUrl: campaign.imageUrl || "",
      achievements: campaign.achievements || [],
      displayOrder: campaign.displayOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCampaign = (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this advocacy campaign?")
    ) {
      deleteCampaign.mutate(id);
    }
  };

  const onCampaignSubmit = (data: z.infer<typeof campaignFormSchema>) => {
    if (data.id) {
      updateCampaign.mutate({ ...data, id: data.id });
    } else {
      createCampaign.mutate(data);
    }
  };

  // Generate status label
  const generateStatusLabel = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Advocacy Campaigns</CardTitle>
        <Button onClick={handleAddCampaign}>
          <Plus className="mr-2 h-4 w-4" />
          Add Campaign
        </Button>
      </CardHeader>
      <CardContent>
        {!campaigns || campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-lg font-medium">
              No advocacy campaigns found
            </div>
            <div className="text-muted-foreground">
              Add your first advocacy campaign using the button above.
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Achievements</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    {campaign.title}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(campaign.status)}`}
                    >
                      {generateStatusLabel(campaign.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.achievements && campaign.achievements.length > 0
                      ? `${campaign.achievements.length} achievements`
                      : "None"}
                  </TableCell>
                  <TableCell>{campaign.displayOrder}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCampaign(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add/Edit Campaign Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign
                ? "Edit Advocacy Campaign"
                : "Add New Advocacy Campaign"}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? "Update the details of your advocacy campaign."
                : "Add a new advocacy campaign to your website."}
            </DialogDescription>
          </DialogHeader>

          <Form {...campaignForm}>
            <form
              onSubmit={campaignForm.handleSubmit(onCampaignSubmit)}
              className="space-y-4"
            >
              <FormField
                control={campaignForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Campaign Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={campaignForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the campaign"
                        className="h-24"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={campaignForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={campaignForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={campaignForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={campaignForm.control}
                name="achievements"
                render={() => (
                  <FormItem>
                    <FormLabel>Achievements</FormLabel>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add an achievement"
                          value={achievementInput}
                          onChange={(e) => setAchievementInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAchievement();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addAchievement}
                        >
                          Add
                        </Button>
                      </div>

                      {watchedAchievements && watchedAchievements.length > 0 ? (
                        <div className="rounded-md border p-3">
                          <div className="text-sm font-medium">
                            Current Achievements:
                          </div>
                          <ul className="mt-2 space-y-2">
                            {watchedAchievements.map((achievement, index) => (
                              <li
                                key={`achievement-${achievement.substring(0, 10)}-${index}`}
                                className="flex items-center justify-between rounded-md bg-secondary/20 p-2 text-sm"
                              >
                                <span className="mr-2">{achievement}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeAchievement(index)}
                                  className="h-6 w-6"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-center text-sm text-muted-foreground">
                          No achievements added yet
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCampaign ? "Update Campaign" : "Create Campaign"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
