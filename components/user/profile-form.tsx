"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile, useUpdateUserProfile, UserProfile } from "@/lib/data/user-profiles";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/ui/image-upload";

// Form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  businessName: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  userId: Id<"users">;
  onSuccess?: () => void;
}

export function ProfileForm({ userId, onSuccess }: ProfileFormProps) {
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { updateUserProfile, isLoading: isUpdating } = useUpdateUserProfile();
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(profile?.profileImage);
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(profile?.coverImage);

  // Initialize form with profile data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      businessName: profile?.businessName || "",
      location: profile?.location || "",
      description: profile?.description || "",
      profileImage: profile?.profileImage || "",
      coverImage: profile?.coverImage || "",
    },
    values: {
      name: profile?.name || "",
      email: profile?.email || "",
      businessName: profile?.businessName || "",
      location: profile?.location || "",
      description: profile?.description || "",
      profileImage: profileImageUrl || profile?.profileImage || "",
      coverImage: coverImageUrl || profile?.coverImage || "",
    },
  });

  // Handle form submission
  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateUserProfile({
        id: userId,
        ...values,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update profile:", error);
    }
  }

  // Handle profile image upload
  const handleProfileImageUpload = (url: string) => {
    setProfileImageUrl(url);
    form.setValue("profileImage", url);
  };

  // Handle cover image upload
  const handleCoverImageUpload = (url: string) => {
    setCoverImageUrl(url);
    form.setValue("coverImage", url);
  };

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
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information and how others see you on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Your location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself or your business"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div>
                    <FormLabel>Profile Image</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profileImageUrl || profile?.profileImage} />
                        <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <ImageUpload
                        value={profileImageUrl || profile?.profileImage}
                        onChange={handleProfileImageUpload}
                        buttonText="Upload Profile Image"
                      />
                    </div>
                  </div>
                  <div>
                    <FormLabel>Cover Image</FormLabel>
                    <div className="mt-2">
                      {(coverImageUrl || profile?.coverImage) && (
                        <div className="relative w-full h-32 mb-4 rounded-md overflow-hidden">
                          <img
                            src={coverImageUrl || profile?.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <ImageUpload
                        value={coverImageUrl || profile?.coverImage}
                        onChange={handleCoverImageUpload}
                        buttonText="Upload Cover Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardFooter className="px-0 pb-0">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
