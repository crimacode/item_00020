"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Item } from "@/lib/types"

interface InventoryReportsProps {
  items: Item[]
}

export function InventoryReports({ items }: InventoryReportsProps) {
  const totalItems = items.length

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const lowStockItems = useMemo(() => {
    return items.filter((item) => item.quantity < 5)
  }, [items])

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { count: number; value: number }> = {}

    items.forEach((item) => {
      if (!breakdown[item.category]) {
        breakdown[item.category] = { count: 0, value: 0 }
      }

      breakdown[item.category].count += 1
      breakdown[item.category].value += item.price * item.quantity
    })

    return Object.entries(breakdown)
      .map(([category, data]) => ({
        category,
        count: data.count,
        value: data.value,
      }))
      .sort((a, b) => b.value - a.value)
  }, [items])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <CardDescription>Unique inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <CardDescription>Sum of all items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <CardDescription>Items with quantity less than 5</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Items and value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map(({ category, count, value }) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{category}</p>
                    <p className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="font-medium">{formatCurrency(value)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {lowStockItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Items that need to be restocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="font-medium text-destructive">{item.quantity} left</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

