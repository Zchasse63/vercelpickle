"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PexelsImageSelector } from "@/components/ui/pexels-image-selector"
import { ImageIcon } from "lucide-react"

interface PexelsImageModalProps {
  productName?: string
  productCategory?: string
  onImagesSelected: (images: string[]) => void
  initialImages?: string[]
  maxImages?: number
  trigger?: React.ReactNode
  buttonText?: string
  title?: string
  description?: string
}

export function PexelsImageModal({
  productName,
  productCategory,
  onImagesSelected,
  initialImages = [],
  maxImages = 5,
  trigger,
  buttonText = "Select Images from Pexels",
  title = "Select Product Images",
  description = "Search and select high-quality images from Pexels for your product"
}: PexelsImageModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>(initialImages)

  const handleSave = () => {
    onImagesSelected(selectedImages)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" data-testid="open-pexels-modal">
            <ImageIcon className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto" data-testid="pexels-modal">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <PexelsImageSelector
            productName={productName}
            productCategory={productCategory}
            onSelectImages={setSelectedImages}
            initialImages={initialImages}
            maxImages={maxImages}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="cancel-button">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="save-images-button">
            Save {selectedImages.length} {selectedImages.length === 1 ? 'Image' : 'Images'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
