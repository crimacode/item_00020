"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryTable } from "@/components/inventory-table"
import { ItemDialog } from "@/components/item-dialog"
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
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Item | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
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

  const handleEditItem = (updatedItem: Item) => {
    setItems(
      items.map((item) =>
        item.id === updatedItem.id ? { ...updatedItem, lastUpdated: new Date().toISOString() } : item,
      ),
    )
    toast({
      title: "Item Updated",
      description: `${updatedItem.name} has been updated.`,
    })
  }

  const handleSaveItem = (item: Item) => {
    if (dialogMode === "add") {
      handleAddItem(item)
    } else {
      handleEditItem(item)
    }
  }

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((item) => item.id === id)
    setCurrentItem(itemToDelete || null)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentItem) {
      setItems(items.filter((item) => item.id !== currentItem.id))
      toast({
        title: "Item Deleted",
        description: `${currentItem.name} has been removed from inventory.`,
      })
      setIsDeleteDialogOpen(false)
      setCurrentItem(null)
    }
  }

  const openAddDialog = () => {
    setDialogMode("add")
    setCurrentItem(null)
    setIsItemDialogOpen(true)
  }

  const openEditDialog = (item: Item) => {
    setDialogMode("edit")
    setCurrentItem(item)
    setIsItemDialogOpen(true)
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
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </TabsContent>
        <TabsContent value="reports">
          <InventoryReports items={items} />
        </TabsContent>
      </Tabs>

      <ItemDialog
        open={isItemDialogOpen}
        onOpenChange={setIsItemDialogOpen}
        onSave={handleSaveItem}
        existingItems={items}
        item={currentItem}
        mode={dialogMode}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={currentItem?.name || ""}
      />
    </div>
  )
}

