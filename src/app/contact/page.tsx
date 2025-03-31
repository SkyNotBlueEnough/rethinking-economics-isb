"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { contactFormSchema } from "~/lib/types/contact";
import type { z } from "zod";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "",
  });
  const [formErrors, setFormErrors] = useState<z.ZodFormattedError<
    z.infer<typeof contactFormSchema>
  > | null>(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Clear errors for this field when user starts typing
    if (formErrors?.[name as keyof typeof formState]?._errors?.length) {
      setFormErrors((prev) => {
        if (!prev) return null;
        const newErrors = { ...prev };
        // Create a new object without the specific field
        const { [name as keyof typeof formState]: _, ...rest } = newErrors;
        return rest as z.ZodFormattedError<z.infer<typeof contactFormSchema>>;
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, inquiryType: value }));

    // Clear errors for inquiry type when user selects something
    if (formErrors?.inquiryType?._errors?.length) {
      setFormErrors((prev) => {
        if (!prev) return null;
        const newErrors = { ...prev };
        // Create a new object without the inquiryType field
        const { inquiryType: _, ...rest } = newErrors;
        return rest as z.ZodFormattedError<z.infer<typeof contactFormSchema>>;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const result = contactFormSchema.safeParse(formState);

    if (!result.success) {
      // Set validation errors
      setFormErrors(result.error.format());
      return;
    }

    // Clear previous errors
    setFormErrors(null);

    try {
      setIsSubmitting(true);

      // Submit form data to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      // Show success message
      toast.success(
        "Thank you for your message. We will get back to you soon!",
      );

      // Reset form
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <BreadcrumbPage>Contact Us</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">Contact Us</div>
        <div className="mt-2 text-muted-foreground">
          Get in touch with our team for inquiries, collaborations, or support.
        </div>
      </div>

      {isLoading ? (
        <ContactSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-map-pin"
                          aria-hidden="true"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Our Office</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          123 Economics Street, F-7/1
                          <br />
                          Islamabad, Pakistan
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-mail"
                          aria-hidden="true"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <div>General Inquiries:</div>
                          <div className="text-primary">
                            info@reisbthinktank.com
                          </div>
                          <div className="mt-2">Media:</div>
                          <div className="text-primary">
                            media@reisbthinktank.com
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-phone"
                          aria-hidden="true"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <div>Office:</div>
                          <div className="text-primary">+92 51 1234567</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-clock"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Office Hours</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <div>Monday - Friday:</div>
                          <div>9:00 AM - 5:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="font-medium">Connect With Us</div>
                    <div className="flex gap-4">
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <span className="sr-only">Follow us on Twitter</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <span className="sr-only">Follow us on Facebook</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <span className="sr-only">
                          Connect with us on LinkedIn
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <span className="sr-only">
                          Subscribe to our YouTube channel
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                          <path d="m10 15 5-3-5-3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-xl font-semibold">Send Us a Message</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={!!formErrors?.name?._errors?.length}
                        className={
                          formErrors?.name?._errors?.length
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {formErrors?.name?._errors?.length && (
                        <div className="text-sm text-destructive">
                          {formErrors.name._errors[0]}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        value={formState.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={!!formErrors?.email?._errors?.length}
                        className={
                          formErrors?.email?._errors?.length
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {formErrors?.email?._errors?.length && (
                        <div className="text-sm text-destructive">
                          {formErrors.email._errors[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select
                      value={formState.inquiryType}
                      onValueChange={handleSelectChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        className={
                          formErrors?.inquiryType?._errors?.length
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="membership">
                          Membership Information
                        </SelectItem>
                        <SelectItem value="collaboration">
                          Collaboration Opportunity
                        </SelectItem>
                        <SelectItem value="media">Media Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors?.inquiryType?._errors?.length && (
                      <div className="text-sm text-destructive">
                        {formErrors.inquiryType._errors[0]}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject of your message"
                      value={formState.subject}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      aria-invalid={!!formErrors?.subject?._errors?.length}
                      className={
                        formErrors?.subject?._errors?.length
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {formErrors?.subject?._errors?.length && (
                      <div className="text-sm text-destructive">
                        {formErrors.subject._errors[0]}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={5}
                      value={formState.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      aria-invalid={!!formErrors?.message?._errors?.length}
                      className={
                        formErrors?.message?._errors?.length
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {formErrors?.message?._errors?.length && (
                      <div className="text-sm text-destructive">
                        {formErrors.message._errors[0]}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-label="Loading"
                          aria-hidden="true"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Contact Information Skeleton */}
      <div className="space-y-8 lg:col-span-1">
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      {/* Contact Form Skeleton */}
      <div className="lg:col-span-2">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  );
}
