"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile, useBusinessProfile } from "@/lib/data/user-profiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/user/profile-form";
import { BusinessProfileForm } from "@/components/user/business-profile-form";
import { Loader2, MapPin, Building, Mail, Phone, Globe, Calendar } from "lucide-react";

interface ProfilePageProps {
  userId: Id<"users">;
  isCurrentUser?: boolean;
}

export function ProfilePage({ userId, isCurrentUser = false }: ProfilePageProps) {
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { data: businessProfile, isLoading: isLoadingBusinessProfile } = useBusinessProfile(userId);
  const [activeTab, setActiveTab] = useState("profile");

  if (isLoadingProfile || isLoadingBusinessProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold">User not found</h2>
        <p className="text-muted-foreground">The requested user profile could not be found.</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gray-200 rounded-lg overflow-hidden">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200" />
          )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row gap-6 p-6 -mt-16">
          <div className="flex-shrink-0 ml-4">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={profile.profileImage} />
              <AvatarFallback className="text-4xl">{profile.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow mt-10 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Badge variant={profile.role === "seller" ? "default" : "outline"}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                  {profile.verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
                {profile.businessName && (
                  <div className="flex items-center gap-2 mt-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.businessName}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
              {isCurrentUser && (
                <div className="mt-4 md:mt-0">
                  <Button onClick={() => setActiveTab("edit")}>Edit Profile</Button>
                </div>
              )}
            </div>
            {profile.description && (
              <p className="mt-4 text-muted-foreground">{profile.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          {isCurrentUser && (
            <>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="edit-business">Edit Business</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View detailed information about {isCurrentUser ? "your" : "this user's"} profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    {businessProfile?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{businessProfile.phone}</span>
                      </div>
                    )}
                    {businessProfile?.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={businessProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {businessProfile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Member since {formatDate(profile.createdAt)}</span>
                    </div>
                    {profile.rating !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span>{profile.rating.toFixed(1)} ({profile.reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="mt-6">
          {businessProfile ? (
            <Card>
              <CardHeader>
                <CardTitle>{businessProfile.businessName}</CardTitle>
                <CardDescription>
                  {businessProfile.industry} • {businessProfile.businessType.charAt(0).toUpperCase() + businessProfile.businessType.slice(1)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">About</h3>
                  <Separator className="my-2" />
                  <p>{businessProfile.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{businessProfile.email}</span>
                      </div>
                      {businessProfile.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{businessProfile.phone}</span>
                        </div>
                      )}
                      {businessProfile.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={businessProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {businessProfile.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Address</h3>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <p>{businessProfile.address.street}</p>
                      <p>{businessProfile.address.city}, {businessProfile.address.state} {businessProfile.address.zipCode}</p>
                      <p>{businessProfile.address.country}</p>
                    </div>
                  </div>
                </div>

                {businessProfile.certifications && businessProfile.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium">Certifications</h3>
                    <Separator className="my-2" />
                    <div className="flex flex-wrap gap-2">
                      {businessProfile.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Business Profile</CardTitle>
                <CardDescription>
                  {isCurrentUser
                    ? "You haven't created a business profile yet."
                    : "This user hasn't created a business profile yet."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCurrentUser && (
                  <Button onClick={() => setActiveTab("edit-business")}>
                    Create Business Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Edit Profile Tab */}
        {isCurrentUser && (
          <TabsContent value="edit" className="mt-6">
            <ProfileForm userId={userId} onSuccess={() => setActiveTab("profile")} />
          </TabsContent>
        )}

        {/* Edit Business Profile Tab */}
        {isCurrentUser && (
          <TabsContent value="edit-business" className="mt-6">
            <BusinessProfileForm userId={userId} onSuccess={() => setActiveTab("business")} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
