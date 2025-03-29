"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import type { TeamMember } from "~/lib/types/about";

export default function TeamPage() {
  const { data: allTeamMembers, isLoading } =
    api.about.getAllTeamMembers.useQuery();

  // Filter team members by category
  const leadershipTeam =
    allTeamMembers?.filter((member) => member.category === "leadership") ?? [];
  const facultyTeam =
    allTeamMembers?.filter((member) => member.category === "faculty") ?? [];
  const studentTeam =
    allTeamMembers?.filter((member) => member.category === "students") ?? [];

  if (isLoading) {
    return <TeamSkeleton />;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-xl font-semibold">Our Team</div>
        <div className="mt-2 text-muted-foreground">
          Meet the dedicated individuals who drive our mission to transform
          economic discourse in Pakistan.
        </div>
      </div>

      <Tabs defaultValue="leadership" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="students">Students & Fellows</TabsTrigger>
        </TabsList>

        <TabsContent value="leadership">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leadershipTeam.length > 0 ? (
              leadershipTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No leadership team members found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="faculty">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facultyTeam.length > 0 ? (
              facultyTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No faculty team members found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentTeam.length > 0 ? (
              studentTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No student team members found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 rounded-lg bg-muted p-6">
        <div className="text-xl font-semibold">Join Our Team</div>
        <div className="mt-2 text-muted-foreground">
          We&apos;re always looking for passionate individuals to join our
          mission. If you&apos;re interested in contributing to our work, please
          reach out to us at{" "}
          <span className="font-medium">careers@reisbthinktank.com</span>
        </div>
      </div>
    </div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={member.imageUrl ?? ""}
              alt={`Photo of ${member.name}`}
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  member.name,
                )}&background=random`;
              }}
            />
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 space-y-1">
            <div className="text-lg font-semibold">{member.name}</div>
            <div className="text-sm font-medium text-primary">
              {member.role}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {member.bio}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamSkeleton() {
  // Create an array of unique IDs for the skeleton items
  const skeletonIds = ["sk1", "sk2", "sk3"];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skeletonIds.map((id) => (
            <Skeleton key={id} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}
