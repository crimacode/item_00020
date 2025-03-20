import { Inventory } from "@/components/inventory"

export default function Home() {
  return (
    <main className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management System</h1>
      <Inventory />
    </main>
  )
}

