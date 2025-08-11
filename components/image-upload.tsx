"use client"

import * as React from "react"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  value?: string
  onChange?: (value: string) => void
  onRemove?: () => void
  disabled?: boolean
  label?: string
  description?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  label = "Hình ảnh",
  description = "Chọn hình ảnh để tải lên",
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string>(value || "")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onChange?.(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreview("")
    onRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative inline-block">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={handleClick}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          <span className="text-sm text-muted-foreground/50 mt-2">Chọn ảnh</span>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
