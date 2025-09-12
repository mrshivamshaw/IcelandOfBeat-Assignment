"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"

interface FieldConfig {
  name: string
  label: string
  type: "text" | "textarea" | "number" | "select" | "boolean" | "image"
  options?: { value: string | boolean; label: string }[] // For select/boolean fields
  required?: boolean
  transform?: {
    toApi?: (value: any) => any // Transform value before sending to API
    fromApi?: (value: any) => any // Transform value when receiving from API
  }
}

interface EntityFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  entityName: string
  fields: FieldConfig[]
  initialData?: Record<string, any>
  onSubmit?: (data: Record<string, any>, file?: File) => Promise<void>
  isSubmitting?: boolean
}

export default function EntityFormModal({
  isOpen,
  onOpenChange,
  mode,
  entityName,
  fields,
  initialData,
  onSubmit,
  isSubmitting,
}: EntityFormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialData && (mode === "edit" || mode === "view")) {
      const transformedData = fields.reduce((acc, field) => {
        const value = initialData[field.name]
        if (field.type === "image") {
          setImagePreview(value || null)
        } else {
          acc[field.name] = field.transform?.fromApi ? field.transform.fromApi(value) : value
        }
        return acc
      }, {} as Record<string, any>)
      setFormData(transformedData)
    } else {
      const defaultData = fields.reduce((acc, field) => {
        if (field.type !== "image") {
          acc[field.name] = field.type === "boolean" ? true : field.type === "number" ? "" : ""
        }
        return acc
      }, {} as Record<string, any>)
      setFormData(defaultData)
      setImagePreview(null)
      setImageFile(null)
    }
  }, [initialData, mode, fields])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImageFile(null)
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view" || !onSubmit) return

    const transformedData = fields.reduce((acc, field) => {
      if (field.type !== "image") {
        const value = formData[field.name]
        acc[field.name] = field.transform?.toApi ? field.transform.toApi(value) : value
      }
      return acc
    }, {} as Record<string, any>)

    try {
      await onSubmit(transformedData, imageFile || undefined)
      onOpenChange(false)
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error(error)
    }
  }

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] ?? ""

    if (field.type === "image") {
      if (mode === "view") {
        return imagePreview ? (
          <img src={imagePreview} alt={`${entityName} image`} className="col-span-3 max-h-48 object-cover rounded" />
        ) : (
          <p className="col-span-3 text-gray-500">No image available</p>
        )
      }
      return (
        <div className="col-span-3 space-y-2">
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="max-h-48 object-cover rounded" />
          )}
          <Input
            id={field.name}
            name={field.name}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
            disabled={mode === "view"}
          />
        </div>
      )
    }

    if (mode === "view") {
      if (field.type === "boolean") {
        return (
          <Badge variant={value ? "default" : "secondary"} className="mt-2">
            {value ? "Active" : "Inactive"}
          </Badge>
        )
      }
      return <p className="col-span-3">{value?.toString() || "N/A"}</p>
    }

    switch (field.type) {
      case "text":
      case "number":
        return (
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            value={value}
            onChange={handleInputChange}
            className="col-span-3"
            required={field.required}
            disabled={mode === "view"}
          />
        )
      case "textarea":
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleInputChange}
            className="col-span-3"
            required={field.required}
            disabled={mode === "view"}
          />
        )
      case "select":
      case "boolean":
        return (
          <Select
            name={field.name}
            value={value?.toString()}
            onValueChange={(val) => handleSelectChange(field.name, field.type === "boolean" ? val === "true" : val)}
            disabled={mode === "view"}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? `Add New ${entityName}` : mode === "edit" ? `Edit ${entityName}` : `View ${entityName}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right font-bold">
                  {field.label}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "create" ? `Save ${entityName}` : `Update ${entityName}`}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}