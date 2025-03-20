"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { type Item, CATEGORIES } from "@/lib/types"

const defaultValues = {
  id: "",
  name: "",
  description: "", // Keep this for compatibility but don't show in form
  category: "",
  quantity: 0,
  price: 0,
  supplier: "", // Keep this for compatibility but don't show in form
}

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: Item) => void
  existingItems: Item[]
}

export function AddItemDialog({ open, onOpenChange, onSave, existingItems }: AddItemDialogProps) {
  // Create a dynamic schema that includes all validations
  const createItemSchema = () => {
    return z.object({
      id: z.string().optional(),
      name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .refine((name) => !existingItems.some((item) => item.name.toLowerCase() === name.toLowerCase()), {
          message: "An item with this name already exists",
        }),
      description: z.string().optional(), // Make optional
      category: z.string().min(1, { message: "Please select a category" }),
      quantity: z.coerce
        .number()
        .int()
        .refine((val) => val > 0, { message: "Quantity must be greater than 0" }),
      price: z.coerce.number().refine((val) => val > 0, { message: "Price must be greater than 0" }),
      supplier: z.string().optional(), // Make optional
      lastUpdated: z.string().optional(),
    })
  }

  const form = useForm<z.infer<ReturnType<typeof createItemSchema>>>({
    resolver: zodResolver(createItemSchema()),
    defaultValues,
    mode: "onSubmit", // Only validate on submit
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  const onSubmit = (values: z.infer<ReturnType<typeof createItemSchema>>) => {
    // Add empty values for description and supplier
    const itemToSave = {
      ...values,
      description: "",
      supplier: "",
    }
    onSave(itemToSave as Item)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Fill in the details to add a new inventory item.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

