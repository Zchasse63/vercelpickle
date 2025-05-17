"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Id } from "@/convex/_generated/dataModel";
import {
  useBusinessProfile,
  useCreateBusinessProfile,
  useUpdateBusinessProfile,
  BusinessProfile,
} from "@/lib/data/user-profiles";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Form schema
const businessProfileSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  businessType: z.enum(["distributor", "restaurant", "retailer", "manufacturer", "other"], {
    message: "Please select a business type.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.object({
    street: z.string().min(2, { message: "Street is required." }),
    city: z.string().min(2, { message: "City is required." }),
    state: z.string().min(2, { message: "State is required." }),
    zipCode: z.string().min(2, { message: "Zip code is required." }),
    country: z.string().min(2, { message: "Country is required." }),
  }),
  socialMedia: z
    .object({
      instagram: z.string().optional().or(z.literal("")),
      facebook: z.string().optional().or(z.literal("")),
      twitter: z.string().optional().or(z.literal("")),
      linkedin: z.string().optional().or(z.literal("")),
    })
    .optional(),
  certifications: z.array(z.string()).optional(),
});

type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;

interface BusinessProfileFormProps {
  userId: Id<"users">;
  onSuccess?: () => void;
}

export function BusinessProfileForm({ userId, onSuccess }: BusinessProfileFormProps) {
  const { data: profile, isLoading: isLoadingProfile } = useBusinessProfile(userId);
  const { createBusinessProfile, isLoading: isCreating } = useCreateBusinessProfile();
  const { updateBusinessProfile, isLoading: isUpdating } = useUpdateBusinessProfile();

  // Initialize form with profile data
  const form = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessName: profile?.businessName || "",
      businessType: (profile?.businessType as any) || "distributor",
      industry: profile?.industry || "",
      description: profile?.description || "",
      website: profile?.website || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      address: profile?.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      socialMedia: profile?.socialMedia || {
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
      },
      certifications: profile?.certifications || [],
    },
    values: {
      businessName: profile?.businessName || "",
      businessType: (profile?.businessType as any) || "distributor",
      industry: profile?.industry || "",
      description: profile?.description || "",
      website: profile?.website || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      address: profile?.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      socialMedia: profile?.socialMedia || {
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
      },
      certifications: profile?.certifications || [],
    },
  });

  // Handle form submission
  async function onSubmit(values: BusinessProfileFormValues) {
    try {
      if (profile) {
        // Update existing profile
        await updateBusinessProfile({
          id: profile.id,
          ...values,
        });
        toast({
          title: "Success",
          description: "Business profile updated successfully.",
        });
      } else {
        // Create new profile
        await createBusinessProfile({
          ...values,
        });
        toast({
          title: "Success",
          description: "Business profile created successfully.",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save business profile. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to save business profile:", error);
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile ? "Update Business Profile" : "Create Business Profile"}</CardTitle>
        <CardDescription>
          {profile
            ? "Update your business information to help customers find and understand your business."
            : "Create a business profile to showcase your business on the platform."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="retailer">Retailer</SelectItem>
                          <SelectItem value="manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Your industry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourbusiness.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your business"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address.zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pb-0">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {profile ? "Update Profile" : "Create Profile"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
