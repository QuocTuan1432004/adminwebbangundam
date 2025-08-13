"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Bell,
  CreditCard,
  FolderTree,
  Settings,
  LogOut,
} from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { AdminAuthService } from "@/hooks/user/userAuth"; // THÊM IMPORT

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { title: "Dashboard", icon: Home, id: "dashboard" },
  { title: "Quản lý danh mục", icon: FolderTree, id: "dashboard/categories" },
  { title: "Quản lý sản phẩm", icon: Package, id: "dashboard/products" },
  { title: "Quản lý đơn hàng", icon: ShoppingCart, id: "dashboard/orders" },
  { title: "Quản lý khách hàng", icon: Users, id: "dashboard/customers" },
  { title: "Thông báo", icon: Bell, id: "dashboard/notifications" },
  { title: "Lịch sử thanh toán", icon: CreditCard, id: "dashboard/payments" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const [admin, setAdmin] = React.useState<any>(null); // THAY ĐỔI: Thêm state cho admin

  // THAY ĐỔI: Lấy thông tin admin từ AdminAuthService
  React.useEffect(() => {
    const adminData = AdminAuthService.getAdminInfo();
    setAdmin(adminData);
  }, []);

  const handleLogout = async () => {
  try {
    const result = await AdminAuthService.logout();
    
    if (result.success) {
      // Redirect to root page (login page)
      router.push("/");
      // Hoặc force redirect
      // window.location.href = "/";
    }
  } catch (error) {
    console.error('Logout failed:', error);
    // Force redirect anyway
    router.push("/");
  }
};

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">GUNDŌKAI</span>
                <span className="truncate text-xs">Admin Panel</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton onClick={() => router.push(`/${item.id}`)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24&text=A" />
                        <AvatarFallback>
                          {/* THAY ĐỔI: Hiển thị thông tin admin thật */}
                          {admin?.fullName?.charAt(0) || admin?.email?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {/* THAY ĐỔI: Hiển thị tên admin thật */}
                        {admin?.fullName || admin?.email || "Admin"}
                      </span>
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
              <Button variant="outline" size="icon" className="border-slate-200">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32&text=A"
                        alt="Avatar"
                      />
                      <AvatarFallback className="bg-slate-100">
                        {/* THAY ĐỔI: Hiển thị thông tin admin thật */}
                        {admin?.fullName?.charAt(0) || admin?.email?.charAt(0) || "A"}
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
