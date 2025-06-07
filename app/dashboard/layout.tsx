"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import {
  Package,
  ShoppingCart,
  FileText,
  Users,
  LogOut,
} from "lucide-react"

const navigation = [
  {
    name: "Productos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Órdenes",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Prescripciones",
    href: "/dashboard/prescriptions",
    icon: FileText,
  },
  {
    name: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-gray-800">
                  FarmaSalud
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  if (item.adminOnly && session?.user.role !== "ADMIN") {
                    return null
                  }
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === item.href
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
