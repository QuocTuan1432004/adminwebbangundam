"use client";

import React from "react";

import { useRouter, usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Users,
  Bell,
  CreditCard,
  FolderTree,
  Home,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  {
    title: "Quản lý danh mục",
    icon: FolderTree,
    href: "/dashboard/categories",
  },
  { title: "Quản lý sản phẩm", icon: Package, href: "/dashboard/products" },
  { title: "Quản lý đơn hàng", icon: ShoppingCart, href: "/dashboard/orders" },
  { title: "Quản lý khách hàng", icon: Users, href: "/dashboard/customers" },
  { title: "Thông báo", icon: Bell, href: "/dashboard/notifications" },
  {
    title: "Lịch sử thanh toán",
    icon: CreditCard,
    href: "/dashboard/payments",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUser");
    router.push("/");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar variant="inset" className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1">
                <img
                  src="images/ChatGPT Image 08_43_04 23 thg 7, 2025.png"
                  alt="GUNDŌKAI"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-white">GUNDŌKAI</span>
                <span className="truncate text-xs text-slate-300">
                  Admin Panel
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-600 font-medium">
                Menu chính
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        onClick={() => router.push(item.href)}
                        isActive={pathname === item.href}
                        className="hover:bg-slate-100 data-[active=true]:bg-slate-900 data-[active=true]:text-white data-[active=true]:font-medium"
                      >
                        {React.createElement(item.icon, {
                          className: "h-4 w-4",
                        })}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-slate-200 bg-white">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:bg-slate-100">
                      <Avatar className="h-6 w-6 border border-slate-200">
                        <AvatarImage src="/placeholder.svg?height=24&width=24&text=A" />
                        <AvatarFallback className="bg-slate-900 text-white text-xs">
                          A
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Admin</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-(--radix-popper-anchor-width) border-slate-200"
                  >
                    <DropdownMenuItem className="hover:bg-slate-100">
                      <Settings className="mr-2 h-4 w-4" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsLogoutDialogOpen(true)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-4 bg-white shadow-sm">
            <SidebarTrigger className="-ml-1 hover:bg-slate-100" />
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-slate-200 hover:bg-slate-100 bg-transparent"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-slate-100"
                  >
                    <Avatar className="h-8 w-8 border border-slate-200">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=A" />
                      <AvatarFallback className="bg-slate-900 text-white text-xs">
                        A
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 border-slate-200"
                  align="end"
                  forceMount
                >
                  <DropdownMenuItem className="hover:bg-slate-100">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-6 bg-slate-50">
            {children}
          </div>
        </SidebarInset>
      </div>

      {/* Dialog xác nhận đăng xuất */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              Xác nhận đăng xuất
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
              className="border-slate-200 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Đăng xuất
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
