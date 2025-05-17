"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  buttonText?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  buttonText = "Upload Image",
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Function to handle file upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pickle-marketplace"); // Replace with your Cloudinary upload preset

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      onChange(data.secure_url);

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // For demo purposes, we'll use a mock upload function
  const handleMockUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create a local URL for the file
      const url = URL.createObjectURL(file);
      onChange(url);

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // For demo purposes, we'll use the Pexels API to get a random image
  const handlePexelsUpload = async () => {
    try {
      setIsUploading(true);

      // Fetch a random image from Pexels
      const response = await fetch(
        "https://api.pexels.com/v1/search?query=food&per_page=1&page=" + Math.floor(Math.random() * 100),
        {
          headers: {
            Authorization: "WvdmE8BBmfJxmj8uCSVrSJ8QkLiH3JRvQKsYygJn3Dj0V3z7fJDmsSgC", // Pexels API key
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image from Pexels");
      }

      const data = await response.json();
      const imageUrl = data.photos[0]?.src?.large;

      if (!imageUrl) {
        throw new Error("No image found");
      }

      onChange(imageUrl);

      toast({
        title: "Image selected",
        description: "A random image has been selected from Pexels.",
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      toast({
        title: "Failed to get image",
        description: "There was an error getting a random image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={isUploading || disabled}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {buttonText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handlePexelsUpload}
          disabled={isUploading || disabled}
        >
          Random Image
        </Button>
      </div>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleMockUpload}
        className="hidden"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
