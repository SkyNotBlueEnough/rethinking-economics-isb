"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { useEffect, useState } from "react";

// Define team member type
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  category: "leadership" | "faculty" | "students";
}

export default function TeamPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock team data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Dr. Amina Khan",
      role: "Executive Director",
      bio: "Dr. Khan is an economist with over 15 years of experience in development economics. She previously worked at the World Bank and has published extensively on economic policy in South Asia.",
      imageUrl: "/images/team/amina-khan.jpg",
      category: "leadership",
    },
    {
      id: "2",
      name: "Dr. Faisal Ahmed",
      role: "Research Director",
      bio: "Dr. Ahmed specializes in monetary policy and financial regulation. He has advised several central banks and taught at leading universities in Pakistan and abroad.",
      imageUrl: "/images/team/faisal-ahmed.jpg",
      category: "leadership",
    },
    {
      id: "3",
      name: "Subtain Zahid",
      role: "Communications Director",
      bio: "Subtain has a background in journalism and public policy. He leads our media engagement and public outreach efforts.",
      imageUrl: "/images/team/subtain-zahid.jpg",
      category: "leadership",
    },
    {
      id: "4",
      name: "Dr. Hassan Raza",
      role: "Professor of Economics",
      bio: "Dr. Raza is a leading heterodox economist specializing in institutional economics. He has been instrumental in developing alternative economic curricula.",
      imageUrl: "/images/team/hassan-raza.jpg",
      category: "faculty",
    },
    {
      id: "5",
      name: "Dr. Saima Parveen",
      role: "Professor of Development Studies",
      bio: "Dr. Parveen's research focuses on gender and economic development. She has led several research projects on women's economic empowerment in rural Pakistan.",
      imageUrl: "/images/team/saima-parveen.jpg",
      category: "faculty",
    },
    {
      id: "6",
      name: "Dr. Omar Qureshi",
      role: "Professor of Economic History",
      bio: "Dr. Qureshi specializes in the economic history of South Asia. His work emphasizes the importance of historical context in economic analysis.",
      imageUrl: "/images/team/omar-qureshi.jpg",
      category: "faculty",
    },
    {
      id: "7",
      name: "Aisha Tariq",
      role: "Research Fellow",
      bio: "Aisha is a PhD candidate researching alternative economic indicators for measuring well-being and sustainability in developing economies.",
      imageUrl: "/images/team/aisha-tariq.jpg",
      category: "students",
    },
    {
      id: "8",
      name: "Bilal Mahmood",
      role: "Student Coordinator",
      bio: "Bilal is an economics student who leads our university outreach programs and coordinates student chapters across Pakistan.",
      imageUrl: "/images/team/bilal-mahmood.jpg",
      category: "students",
    },
    {
      id: "9",
      name: "Sara Javed",
      role: "Research Assistant",
      bio: "Sara is working on ecological economics and sustainable development models for Pakistan's agricultural sector.",
      imageUrl: "/images/team/sara-javed.jpg",
      category: "students",
    },
  ];

  // Filter team members by category
  const leadershipTeam = teamMembers.filter(
    (member) => member.category === "leadership",
  );
  const facultyTeam = teamMembers.filter(
    (member) => member.category === "faculty",
  );
  const studentTeam = teamMembers.filter(
    (member) => member.category === "students",
  );

  return (
    <div>
      {isLoading ? (
        <TeamSkeleton />
      ) : (
        <>
          <div className="mb-8">
            <div className="text-xl font-semibold">Our Team</div>
            <div className="mt-2 text-muted-foreground">
              Meet the dedicated individuals who drive our mission to transform
              economic discourse in Pakistan.
            </div>
          </div>

          <Tabs defaultValue="leadership" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="students">Students & Fellows</TabsTrigger>
            </TabsList>

            <TabsContent value="leadership">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {leadershipTeam.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faculty">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {facultyTeam.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {studentTeam.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 rounded-lg bg-muted p-6">
            <div className="text-xl font-semibold">Join Our Team</div>
            <div className="mt-2 text-muted-foreground">
              We&apos;re always looking for passionate individuals to join our
              mission. If you&apos;re interested in contributing to our work,
              please reach out to us at{" "}
              <span className="font-medium">careers@reisbthinktank.com</span>
            </div>
          </div>
        </>
      )}
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
              src={member.imageUrl}
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
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}
