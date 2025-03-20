export interface Item {
  id: string
  name: string
  description?: string // Make optional
  category: string
  quantity: number
  price: number
  supplier?: string // Make optional
  lastUpdated: string
}

// Add predefined categories
export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Office Supplies",
  "Kitchen",
  "Clothing",
  "Tools",
  "Books",
  "Other",
] as const

export type Category = (typeof CATEGORIES)[number]

