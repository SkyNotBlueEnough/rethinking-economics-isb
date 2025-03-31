"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { api } from "~/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type {
  FAQ,
  MembershipType,
  CollaborationCard,
} from "~/lib/types/memberships";

export default function MembershipsAndCollaborationPage() {
  const [activeTab, setActiveTab] = useState("collaboration");

  // Fetch membership types and FAQs
  const { data: membershipTypes, isLoading: isLoadingMembershipTypes } =
    api.memberships.getAllMembershipTypes.useQuery();

  const {
    data: collaborationFAQs = [],
    isLoading: isLoadingCollaborationFAQs,
  } = api.memberships.getFAQsByCategory.useQuery("collaboration");

  const { data: membershipFAQs = [], isLoading: isLoadingMembershipFAQs } =
    api.memberships.getFAQsByCategory.useQuery("membership");

  const {
    data: collaborationCards = [],
    isLoading: isLoadingCollaborationCards,
  } = api.memberships.getAllCollaborationCards.useQuery();

  const isLoading =
    isLoadingMembershipTypes ||
    isLoadingCollaborationFAQs ||
    isLoadingMembershipFAQs ||
    isLoadingCollaborationCards;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Memberships & Collaboration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">
          Memberships & Collaboration
        </div>
        <div className="mt-2 text-muted-foreground">
          Join our network of economists, researchers, and advocates working to
          transform economic discourse in Pakistan.
        </div>
      </div>

      <Tabs
        defaultValue="collaboration"
        onValueChange={setActiveTab}
        className="mb-8"
      >
        {/* <TabsList> */}
        {/* <TabsTrigger value="collaboration">Collaboration</TabsTrigger> */}
        {/* <TabsTrigger value="memberships">Memberships</TabsTrigger> */}
        {/* </TabsList> */}

        <TabsContent value="collaboration">
          {isLoading ? (
            <CollaborationSkeleton />
          ) : (
            <>
              {/* Collaboration Section */}
              <div className="mb-16">
                <div className="mb-6 text-2xl font-bold">
                  Ways to Collaborate
                </div>
                {collaborationCards.length === 0 ? (
                  <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="text-muted-foreground">
                      We welcome collaboration opportunities with various
                      organizations and individuals. Please check back soon for
                      more details on our collaboration programs or contact us
                      for more information.
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {collaborationCards.map((card) => (
                      <CollaborationCardComponent key={card.id} card={card} />
                    ))}
                  </div>
                )}
              </div>

              {/* FAQs Section */}
              <div>
                <div className="mb-6 text-2xl font-bold">
                  Frequently Asked Questions
                </div>

                {isLoadingCollaborationFAQs ? (
                  <FAQSkeleton />
                ) : collaborationFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {collaborationFAQs.map((faq) => (
                      <AccordionItem
                        key={`faq-${faq.id || 0}`}
                        value={`faq-${faq.id || 0}`}
                      >
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer.includes("•") ||
                          faq.answer.includes("-") ? (
                            <div>
                              {faq.answer
                                .split(/\n/)
                                .map((paragraph, paragraphId) => {
                                  const trimmedParagraph = paragraph.trim();
                                  const uniqueKey = `faq-paragraph-${faq.id}-${paragraphId}`;

                                  if (
                                    trimmedParagraph.startsWith("•") ||
                                    trimmedParagraph.startsWith("-")
                                  ) {
                                    return (
                                      <div
                                        key={uniqueKey}
                                        className="flex items-start"
                                      >
                                        <span className="mr-2 text-primary">
                                          •
                                        </span>
                                        <span>
                                          {trimmedParagraph.replace(
                                            /^[•-]\s*/,
                                            "",
                                          )}
                                        </span>
                                      </div>
                                    );
                                  }

                                  return trimmedParagraph ? (
                                    <div key={uniqueKey} className="mb-2">
                                      {trimmedParagraph}
                                    </div>
                                  ) : null;
                                })}
                            </div>
                          ) : (
                            faq.answer
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    No FAQs available at the moment.
                  </div>
                )}
              </div>

              {/* Contact Section */}
              <div className="mt-16 rounded-lg bg-muted p-6">
                <div className="text-xl font-semibold">Get in Touch</div>
                <div className="mt-2 text-muted-foreground">
                  For more information about collaboration opportunities, please
                  contact us at{" "}
                  <span className="font-medium">info@reisbthinktank.com</span>{" "}
                  or fill out our contact form.
                </div>
                <div className="mt-4">
                  <Button>Contact Us</Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="memberships">
          {isLoading ? (
            <MembershipsSkeleton />
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-4 text-2xl font-bold">
                  Membership Benefits
                </div>
                <div className="mb-6 text-muted-foreground">
                  Becoming a member of Rethinking Economics ISB gives you access
                  to exclusive resources, events, and a network of economists
                  committed to transforming economic discourse in Pakistan.
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {!membershipTypes || membershipTypes.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-muted-foreground">
                      No membership types available at the moment.
                    </div>
                  ) : (
                    membershipTypes.map((membershipType) => (
                      <MembershipTypeCard
                        key={membershipType.id}
                        membershipType={membershipType}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Membership FAQs */}
              <div className="mt-12">
                <div className="mb-6 text-2xl font-bold">
                  Frequently Asked Questions About Membership
                </div>

                {isLoadingMembershipFAQs ? (
                  <FAQSkeleton />
                ) : membershipFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {membershipFAQs.map((faq) => (
                      <AccordionItem
                        key={`faq-${faq.id || 0}`}
                        value={`faq-${faq.id || 0}`}
                      >
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    No FAQs available at the moment.
                  </div>
                )}
              </div>

              {/* Membership Action */}
              <div className="mt-16 rounded-lg bg-muted p-6">
                <div className="text-xl font-semibold">Ready to Join?</div>
                <div className="mt-2 text-muted-foreground">
                  Apply for membership to become part of our community of
                  economists, researchers, and advocates working to transform
                  economic discourse in Pakistan.
                </div>
                <div className="mt-4">
                  <Button>Apply for Membership</Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Card for displaying membership types
function MembershipTypeCard({
  membershipType,
}: {
  membershipType: MembershipType;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>{membershipType.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col">
        {membershipType.description && (
          <div className="mb-4 text-muted-foreground">
            {membershipType.description}
          </div>
        )}

        {membershipType.benefits && (
          <div className="mt-auto">
            <div className="mb-2 font-medium">Benefits:</div>
            <div className="text-sm text-muted-foreground">
              {membershipType.benefits}
            </div>
          </div>
        )}

        <div className="mt-4 border-t pt-4">
          <Button className="w-full">Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Card for displaying collaboration opportunities
function CollaborationCardComponent({ card }: { card: CollaborationCard }) {
  // Parse bullet points from string to display as a list
  const bulletPoints = card.bulletPoints
    ? card.bulletPoints.split("\n").filter(Boolean)
    : [];

  // Extract bullet points heading if it exists (format: "HEADING: bullet1\nbullet2\n...")
  let bulletPointsHeading = "Key Points:";
  let processedBulletPoints = [...bulletPoints];

  if (bulletPoints.length > 0) {
    const firstItem = bulletPoints[0];
    if (firstItem?.includes(": ")) {
      const separatorIndex = firstItem.indexOf(": ");

      if (separatorIndex > 0) {
        bulletPointsHeading = `${firstItem.substring(0, separatorIndex)}:`;
        // Remove the heading from the first bullet point
        const remainingText = firstItem.substring(separatorIndex + 1).trim();
        processedBulletPoints = remainingText
          ? [remainingText, ...bulletPoints.slice(1)]
          : bulletPoints.slice(1);
      }
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col">
        {card.description && (
          <div className="mb-4 text-muted-foreground">{card.description}</div>
        )}

        {processedBulletPoints.length > 0 && (
          <div className="mt-auto">
            <div className="mb-2 font-medium">{bulletPointsHeading}</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {processedBulletPoints.map((point, index) => (
                <li
                  key={`${card.id}-bullet-${index}`}
                  className="flex items-start"
                >
                  <span className="mr-2 text-primary">•</span>
                  {point.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CollaborationSkeleton() {
  return (
    <div className="space-y-16">
      {/* Collaboration Section Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      {/* FAQs Skeleton */}
      <FAQSkeleton />

      {/* Contact Section Skeleton */}
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}

function MembershipsSkeleton() {
  return (
    <div className="space-y-16">
      {/* Membership Types Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>

      {/* FAQs Skeleton */}
      <FAQSkeleton />

      {/* Action Section Skeleton */}
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/4" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
