"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  ArrowLeftIcon,
  BellIcon,
  ShieldIcon,
  UserIcon,
  KeyIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    activityDigest: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const handleNotificationChange = (
    setting: keyof typeof notificationSettings,
  ) => {
    setNotificationSettings((prev) => {
      const newSettings = { ...prev, [setting]: !prev[setting] };

      // Optimistic update
      toast.success(
        `${setting} ${newSettings[setting] ? "enabled" : "disabled"}`,
      );

      return newSettings;
    });
  };

  const handleSecurityChange = (setting: keyof typeof securitySettings) => {
    setSecuritySettings((prev) => {
      const newSettings = { ...prev, [setting]: !prev[setting] };

      // Optimistic update
      toast.success(
        `${setting} ${newSettings[setting] ? "enabled" : "disabled"}`,
      );

      return newSettings;
    });
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto max-w-4xl py-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-6 h-10 w-full" />
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and settings
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile")}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <BellIcon className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <ShieldIcon className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() =>
                        handleNotificationChange("emailNotifications")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive marketing and promotional emails
                      </div>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={() =>
                        handleNotificationChange("marketingEmails")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-digest">Activity Digest</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive weekly digest of your account activity
                      </div>
                    </div>
                    <Switch
                      id="activity-digest"
                      checked={notificationSettings.activityDigest}
                      onCheckedChange={() =>
                        handleNotificationChange("activityDigest")
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">
                        Two-Factor Authentication
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={() =>
                        handleSecurityChange("twoFactorAuth")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="login-alerts">Login Alerts</Label>
                      <div className="text-sm text-muted-foreground">
                        Get notified of new login attempts
                      </div>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={() =>
                        handleSecurityChange("loginAlerts")
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <KeyIcon className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    View and manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <div className="font-medium">
                        {user?.primaryEmailAddress?.emailAddress}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <div className="font-medium">{user?.fullName}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">User ID</Label>
                      <div className="font-medium">{user?.id}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Created</Label>
                      <div className="font-medium">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/profile/edit")}
                      className="flex items-center gap-2"
                    >
                      <UserIcon className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        toast.error("This feature is not implemented yet")
                      }
                      className="flex items-center gap-2"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
