"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import type { FieldConfig } from "@/types/types"


interface DayActivity {
  day: number
  maxActivities: string
  availableActivities: string[]
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
  const [formData, setFormData] = useState<Record<string, any> & { dayActivities?: DayActivity[] }>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formMode] = useState(mode)

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
          acc[field.name] = field.type === "boolean" ? true : field.type === "checkbox" || field.type === "dayActivities" ? [] : field.type === "number" ? "" : ""
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

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = (prev[name] || []) as string[]
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        return { ...prev, [name]: currentValues.filter((v: string) => v !== value) }
      }
    })
  }

  const handleDayActivitiesChange = (day: number, field: string, value: any) => {
    setFormData((prev) => {
      const dayActivities = [...(prev.dayActivities || [])]
      const dayIndex = dayActivities.findIndex((d: any) => d.day === day)
      if (dayIndex === -1) {
        dayActivities.push({ day, maxActivities: "", availableActivities: [] as string[]})
      }
      const updatedDay: { day: number; maxActivities: string; availableActivities: string[]; [key: string]: any } = { ...dayActivities[dayIndex] || { day }, [field]: value }
      if (field === "availableActivities") {
        updatedDay.availableActivities = value
      } else {
        updatedDay[field] = value
      }
      if (dayIndex === -1) {
        dayActivities.push(updatedDay)
      } else {
        dayActivities[dayIndex] = updatedDay
      }
      return { ...prev, dayActivities }
    })
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
    const value = formData[field.name] ?? (field.type === "checkbox" || field.type === "dayActivities" ? [] : "")

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
            disabled={formMode === "view"}
          />
        </div>
      )
    }

    if (field.type === "dayActivities") {
      const duration = Number(formData.duration) || 1
      const dayActivities = (value as Array<{ day: number; maxActivities: number; availableActivities: string[] }>) || []

      if (mode === "view") {
        return (
          <div className="col-span-3 space-y-4">
            {dayActivities.map((dayObj) => (
              <div key={dayObj.day} className="space-y-2">
                <h4 className="font-bold">Day {dayObj.day}</h4>
                <p>Max Activities: {dayObj.maxActivities}</p>
                <p>
                  Activities:{" "}
                  {dayObj.availableActivities
                    .map((val: string) => field.options?.find((opt) => opt.value === val)?.label || val)
                    .join(", ") || "None"}
                </p>
              </div>
            ))}
            {dayActivities.length === 0 && <p>No activities assigned</p>}
          </div>
        )
      }

      return (
        <div className="col-span-3 space-y-4">
          {Array.from({ length: duration }, (_, i) => i + 1).map((day) => {
            const dayObj = dayActivities.find((d) => d.day === day) || { maxActivities: "", availableActivities: [] }
            return (
              <div key={day} className="space-y-2 border-b pb-4">
                <h4 className="font-bold">Day {day}</h4>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`maxActivities-${day}`} className="text-right">
                    Max Activities
                  </Label>
                  <Input
                    id={`maxActivities-${day}`}
                    type="number"
                    value={dayObj.maxActivities}
                    onChange={(e) => handleDayActivitiesChange(day, "maxActivities", e.target.value)}
                    className="col-span-3"
                    required={field.required}
                    disabled={formMode === "view"}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Activities</Label>
                  <div className="col-span-3 space-y-2">
                    {field.options?.map((option) => (
                      <div key={option.value.toString()} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dayActivities-${day}-${option.value}`}
                          checked={(dayObj.availableActivities as string[]).includes(option.value.toString())}
                          onCheckedChange={(checked) => {
                            const updatedActivities = checked
                              ? [...dayObj.availableActivities, option.value.toString()]
                              : dayObj.availableActivities.filter((v: string) => v !== option.value.toString())
                            handleDayActivitiesChange(day, "availableActivities", updatedActivities)
                          }}
                          disabled={formMode === "view"}
                        />
                        <Label htmlFor={`dayActivities-${day}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
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
      if (field.type === "checkbox") {
        const selectedLabels = (value as string[])
          .map((val: string) => field.options?.find((opt) => opt.value === val)?.label || val)
          .join(", ")
        return <p className="col-span-3">{selectedLabels || "None"}</p>
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
            disabled={formMode === "view"}
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
            disabled={formMode === "view"}
          />
        )
      case "select":
      case "boolean":
        return (
          <Select
            name={field.name}
            value={value?.toString()}
            onValueChange={(val) => handleSelectChange(field.name, field.type === "boolean" ? val === "true" : val)}
            disabled={formMode === "view"}
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
      case "checkbox":
        return (
          <div className="col-span-3 space-y-2">
            {field.options?.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option.value}`}
                  checked={(value as string[]).includes(option.value.toString())}
                  onCheckedChange={(checked) => handleCheckboxChange(field.name, option.value.toString(), checked as boolean)}
                  disabled={formMode === "view"}
                />
                <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
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
          <div className="max-h-[60vh] overflow-y-auto px-4">
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {formMode === "view" ? "Close" : "Cancel"}
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