"use client";

import { useState, useEffect } from "react";
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

// Define FAQ type
interface FAQ {
  question: string;
  answer: string;
  category: "collaboration";
}

export default function CollaborationPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock FAQs data
  const faqs: FAQ[] = [
    {
      question:
        "How can my organization collaborate with Rethinking Economics?",
      answer:
        "We welcome collaboration opportunities with organizations that share our values and mission. Please contact our partnerships coordinator at partnerships@rethinkingeconomics.pk with a brief description of your organization and proposed collaboration.",
      category: "collaboration",
    },
    {
      question: "What types of collaborative projects do you engage in?",
      answer:
        "We collaborate on research projects, policy advocacy, events, educational initiatives, and public engagement campaigns. We're open to other types of collaboration that align with our mission of transforming economic discourse in Pakistan.",
      category: "collaboration",
    },
    {
      question: "Do you accept interns or volunteers?",
      answer:
        "Yes, we have internship and volunteer programs for students and professionals interested in gaining experience in economic research, policy advocacy, and nonprofit management. Check our website for current opportunities or contact us at info@rethinkingeconomics.pk.",
      category: "collaboration",
    },
    {
      question:
        "What are the benefits of collaborating with Rethinking Economics?",
      answer:
        "Collaborating with us provides access to our network of economists, researchers, and policymakers, as well as opportunities for joint research, publications, and events. We bring expertise in pluralist economics and a commitment to transforming economic discourse in Pakistan.",
      category: "collaboration",
    },
    {
      question: "How long does a typical collaboration last?",
      answer:
        "The duration of collaborations varies depending on the nature of the project. We engage in both short-term projects (such as events or workshops) and long-term partnerships (such as research initiatives or educational programs).",
      category: "collaboration",
    },
  ];

  // Filter FAQs by category
  const collaborationFAQs = faqs.filter(
    (faq) => faq.category === "collaboration",
  );

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
            <BreadcrumbPage>Collaboration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">
          Collaboration Opportunities
        </div>
        <div className="mt-2 text-muted-foreground">
          Partner with us to transform economic discourse in Pakistan through
          research, education, and advocacy.
        </div>
      </div>

      {isLoading ? (
        <CollaborationSkeleton />
      ) : (
        <>
          {/* Collaboration Section */}
          <div className="mb-16">
            <div className="mb-6 text-2xl font-bold">Ways to Collaborate</div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Research Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-muted-foreground">
                    We welcome collaboration with researchers, academic
                    institutions, and think tanks on projects related to
                    pluralist economics, sustainable development, and economic
                    policy in Pakistan.
                  </div>
                  <div>
                    <div className="font-medium">Areas of Interest:</div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Alternative economic frameworks and their application to
                        Pakistan
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Ecological economics and sustainable development
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Feminist economics and care work
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Economic inequality and inclusive growth
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Educational Partnerships</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-muted-foreground">
                    We partner with educational institutions to develop and
                    implement pluralist economics curricula, organize workshops
                    and seminars, and support student-led initiatives.
                  </div>
                  <div>
                    <div className="font-medium">Partnership Activities:</div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Curriculum development and review
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Guest lectures and workshops
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Student chapter support
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Joint conferences and events
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Policy Advocacy Alliances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-muted-foreground">
                    We form alliances with civil society organizations, think
                    tanks, and advocacy groups to promote evidence-based
                    economic policies that prioritize human well-being and
                    environmental sustainability.
                  </div>
                  <div>
                    <div className="font-medium">Advocacy Areas:</div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Green economic recovery
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Progressive taxation and public finance
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Financial inclusion and regulation
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Labor rights and social protection
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media and Public Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-muted-foreground">
                    We collaborate with media organizations, journalists, and
                    content creators to improve economic literacy and broaden
                    public discourse on economic issues.
                  </div>
                  <div>
                    <div className="font-medium">Engagement Opportunities:</div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Expert commentary and analysis
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Joint production of educational content
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Media training for economists
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Public events and discussions
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQs Section */}
          <div>
            <div className="mb-6 text-2xl font-bold">
              Frequently Asked Questions
            </div>

            <Accordion type="single" collapsible className="w-full">
              {collaborationFAQs.map((faq) => (
                <AccordionItem
                  key={`collaboration-${faq.question.substring(0, 15).replace(/\s+/g, "-").toLowerCase()}`}
                  value={`collaboration-${faq.question.substring(0, 15).replace(/\s+/g, "-").toLowerCase()}`}
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
          </div>

          {/* Contact Section */}
          <div className="mt-16 rounded-lg bg-muted p-6">
            <div className="text-xl font-semibold">Get in Touch</div>
            <div className="mt-2 text-muted-foreground">
              For more information about collaboration opportunities, please
              contact us at{" "}
              <span className="font-medium">
                partnerships@rethinkingeconomics.pk
              </span>{" "}
              or fill out our contact form.
            </div>
            <div className="mt-4">
              <Button>Contact Us</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CollaborationSkeleton() {
  return (
    <div className="space-y-16">
      {/* Collaboration Section Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>

      {/* FAQs Skeleton */}
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

      {/* Contact Section Skeleton */}
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}
