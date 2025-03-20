"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryTable } from "@/components/inventory-table"
import { AddItemDialog } from "@/components/add-item-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { InventoryReports } from "@/components/inventory-reports"
import type { Item } from "@/lib/types"

// Define CATEGORIES here
const CATEGORIES = ["Electronics", "Furniture", "Stationery"] as const
type Category = (typeof CATEGORIES)[number]

// Sample initial data
const initialItems: Item[] = [
  {
    id: "1",
    name: "Laptop",
    description: "",
    category: "Electronics",
    quantity: 15,
    price: 1200,
    supplier: "",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Office Chair",
    description: "",
    category: "Furniture",
    quantity: 25,
    price: 250,
    supplier: "",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Printer",
    description: "",
    category: "Electronics",
    quantity: 5,
    price: 350,
    supplier: "",
    lastUpdated: new Date().toISOString(),
  },
]

export function Inventory() {
  const { toast } = useToast()
  const [items, setItems] = useState<Item[]>(initialItems)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter items based on search term (name only)
  const filteredItems = items.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleAddItem = (item: Item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    }
    setItems([...items, newItem])
    toast({
      title: "Item Added",
      description: `${item.name} has been added to inventory.`,
    })
  }

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((item) => item.id === id)
    setItemToDelete(itemToDelete || null)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(items.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "Item Deleted",
        description: `${itemToDelete.name} has been removed from inventory.`,
      })
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const openAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Button onClick={openAddDialog} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <InventoryTable
            items={filteredItems}
            onDelete={handleDeleteItem}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </TabsContent>
        <TabsContent value="reports">
          <InventoryReports items={items} />
        </TabsContent>
      </Tabs>

      <AddItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddItem}
        existingItems={items}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ""}
      />
    </div>
  )
}

