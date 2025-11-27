"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Receipt,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string; role?: string }[]
  role?: string
}

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Rendez-vous",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Consultations",
    href: "/consultations",
    icon: Stethoscope,
  },
  {
    title: "Facturation",
    href: "/billing",
    icon: Receipt,
    children: [
      { title: "Factures", href: "/billing/invoices" },
      { title: "Dépenses", href: "/billing/expenses" },
      { title: "Services", href: "/billing/services" },
    ],
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
    children: [
      { title: "Profil", href: "/settings/profile" },
      { title: "Clinique", href: "/settings/clinic" },
      { title: "Utilisateurs", href: "/settings/users", role: "DOCTOR" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast.success("Déconnexion réussie")
    router.push("/login")
  }

  // Filter nav items based on role
  const filterNavItems = (items: NavItem[]) => {
    return items
      .filter((item) => {
        if (item.role && session?.user?.role !== item.role) {
          return false
        }
        return true
      })
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter((child) => {
              if (child.role && session?.user?.role !== child.role) {
                return false
              }
              return true
            }),
          }
        }
        return item
      })
  }

  const filteredNavItems = filterNavItems(navItems)

  // Get user initials
  const getUserInitials = () => {
    if (!session?.user?.name) return "U"
    const names = session.user.name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }

  // Get role display
  const getRoleDisplay = () => {
    if (session?.user?.role === "DOCTOR") return "Médecin"
    if (session?.user?.role === "ASSISTANT") return "Assistant(e)"
    return "Utilisateur"
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-teal-600">
        <div className="flex items-center justify-center size-10 rounded-xl bg-white/10 backdrop-blur">
          <Stethoscope className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Cabinet Médical</h1>
          <p className="text-xs text-teal-200">El Attaouia</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {filteredNavItems.map((item) => (
            <div key={item.href}>
              {item.children && item.children.length > 0 ? (
                // Parent item with children
                <div>
                  <button
                    onClick={() => toggleExpand(item.href)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive(item.href)
                        ? "bg-white/15 text-white"
                        : "text-teal-100 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      {item.title}
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        expandedItems.includes(item.href) && "rotate-180"
                      )}
                    />
                  </button>
                  {/* Children */}
                  {expandedItems.includes(item.href) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                            pathname === child.href
                              ? "bg-white/15 text-white font-medium"
                              : "text-teal-200 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <div className="size-1.5 rounded-full bg-current" />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Single item
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive(item.href)
                      ? "bg-white/15 text-white"
                      : "text-teal-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="size-5" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-teal-600 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
              <Avatar className="size-9 border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || "Utilisateur"}
                </p>
                <p className="text-xs text-teal-200">{getRoleDisplay()}</p>
              </div>
              <ChevronDown className="size-4 text-teal-200" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="cursor-pointer">
                <Settings className="size-4 mr-2" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="size-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-teal-700 to-teal-800 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-gradient-to-b from-teal-700 to-teal-800">
        <SidebarContent />
      </aside>
    </>
  )
}
