"use client"

import * as React from "react"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Bell,
  CreditCard,
  FolderTree,
  Home,
  Settings,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
} from "lucide-react"
import { getOrdersForAdmin, Order } from "@/hooks/Order/Order"
import { AdminAuthService } from "@/hooks/user/userAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
} from "@/components/ui/sidebar"

// Mock data - cập nhật lại
const parentCategories = [
  {
    id: 1,
    name: "Real Grade (RG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=RG",
    image: "/placeholder.svg?height=100&width=100&text=RG",
  },
  {
    id: 2,
    name: "Master Grade (MG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=MG",
    image: "/placeholder.svg?height=100&width=100&text=MG",
  },
  {
    id: 3,
    name: "Perfect Grade (PG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=PG",
    image: "/placeholder.svg?height=100&width=100&text=PG",
  },
  {
    id: 4,
    name: "High Grade (HG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=HG",
    image: "/placeholder.svg?height=100&width=100&text=HG",
  },
]

const subCategories = [
  {
    id: 1,
    parentId: 1,
    parentName: "Real Grade (RG)",
    name: "RG Gundam",
    description: "Các mô hình Gundam dòng RG",
    image: "/placeholder.svg?height=100&width=100&text=RG-G",
  },
  {
    id: 2,
    parentId: 1,
    parentName: "Real Grade (RG)",
    name: "RG Zaku",
    description: "Các mô hình Zaku dòng RG",
    image: "/placeholder.svg?height=100&width=100&text=RG-Z",
  },
  {
    id: 3,
    parentId: 2,
    parentName: "Master Grade (MG)",
    name: "MG Gundam",
    description: "Các mô hình Gundam dòng MG",
    image: "/placeholder.svg?height=100&width=100&text=MG-G",
  },
  {
    id: 4,
    parentId: 2,
    parentName: "Master Grade (MG)",
    name: "MG Strike",
    description: "Các mô hình Strike dòng MG",
    image: "/placeholder.svg?height=100&width=100&text=MG-S",
  },
  {
    id: 5,
    parentId: 3,
    parentName: "Perfect Grade (PG)",
    name: "PG Unicorn",
    description: "Các mô hình Unicorn dòng PG",
    image: "/placeholder.svg?height=100&width=100&text=PG-U",
  },
  {
    id: 6,
    parentId: 3,
    parentName: "Perfect Grade (PG)",
    name: "PG Strike Freedom",
    description: "Các mô hình Strike Freedom dòng PG",
    image: "/placeholder.svg?height=100&width=100&text=PG-SF",
  },
]

const dashboardStats = {
  totalRevenue: "2,450,000,000",
  totalOrders: 1234,
  totalProducts: 567,
  totalCustomers: 890,
}

const categories = [
  { id: 1, name: "Real Grade (RG)", icon: "🤖", subcategories: ["RG Gundam", "RG Zaku"] },
  { id: 2, name: "Master Grade (MG)", icon: "⚡", subcategories: ["MG Gundam", "MG Strike"] },
  { id: 3, name: "Perfect Grade (PG)", icon: "👑", subcategories: ["PG Unicorn", "PG Strike Freedom"] },
]

const products = [
  {
    id: 1,
    name: "RG RX-78-2 Gundam",
    category: "Real Grade",
    price: 650000,
    stock: 25,
    status: "active",
    thumbnail: "/placeholder.svg?height=60&width=60&text=RG",
  },
  {
    id: 2,
    name: "MG Strike Freedom",
    category: "Master Grade",
    price: 1200000,
    stock: 15,
    status: "active",
    thumbnail: "/placeholder.svg?height=60&width=60&text=MG",
  },
  {
    id: 3,
    name: "PG Unicorn Gundam",
    category: "Perfect Grade",
    price: 3500000,
    stock: 5,
    status: "active",
    thumbnail: "/placeholder.svg?height=60&width=60&text=PG",
  },
]

const orders = [
  {
    id: "ORD001",
    customer: "Nguyễn Văn A",
    date: "2024-01-15",
    total: 1850000,
    status: "completed",
    items: 2,
  },
  {
    id: "ORD002",
    customer: "Trần Thị B",
    date: "2024-01-14",
    total: 650000,
    status: "processing",
    items: 1,
  },
  {
    id: "ORD003",
    customer: "Lê Văn C",
    date: "2024-01-13",
    total: 3500000,
    status: "shipped",
    items: 1,
  },
]

const customers = [
  {
    id: 1,
    username: "nguyenvana",
    email: "nguyenvana@email.com",
    gender: "Nam",
    totalOrders: 5,
    totalSpent: 8500000,
    joinDate: "2023-06-15",
  },
  {
    id: 2,
    username: "tranthib",
    email: "tranthib@email.com",
    gender: "Nữ",
    totalOrders: 3,
    totalSpent: 2100000,
    joinDate: "2023-08-22",
  },
]

const notifications = [
  {
    id: 1,
    message: "Đơn hàng ORD001 đã được thanh toán",
    isRead: false,
    sentAt: "2024-01-15 10:30",
  },
  {
    id: 2,
    message: "Sản phẩm RG RX-78-2 sắp hết hàng",
    isRead: true,
    sentAt: "2024-01-14 15:45",
  },
]

const paymentLogs = [
  {
    id: 1,
    orderId: "ORD001",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@email.com",
    method: "VNPay",
    status: "completed",
    transactionId: "TXN123456",
    amount: 1850000,
    fee: 18500,
    netAmount: 1831500,
    paidAt: "2024-01-15 10:30",
    description: "Thanh toán đơn hàng RG RX-78-2 Gundam",
    bankCode: "NCB",
    cardType: "ATM",
  },
  {
    id: 2,
    orderId: "ORD003",
    customerName: "Lê Văn C",
    customerEmail: "levanc@email.com",
    method: "MoMo",
    status: "completed",
    transactionId: "TXN789012",
    amount: 3500000,
    fee: 35000,
    netAmount: 3465000,
    paidAt: "2024-01-13 14:20",
    description: "Thanh toán đơn hàng PG Unicorn Gundam",
    phoneNumber: "0987654321",
  },
  {
    id: 3,
    orderId: "ORD002",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@email.com",
    method: "ZaloPay",
    status: "failed",
    transactionId: "TXN345678",
    amount: 650000,
    fee: 6500,
    netAmount: 643500,
    paidAt: "2024-01-14 09:15",
    description: "Thanh toán đơn hàng MG Strike Freedom",
    errorCode: "INSUFFICIENT_BALANCE",
    errorMessage: "Số dư không đủ",
  },
]

const menuItems = [
  { title: "Dashboard", icon: Home, id: "dashboard" },
  { title: "Quản lý danh mục", icon: FolderTree, id: "categories" },
  { title: "Quản lý sản phẩm", icon: Package, id: "products" },
  { title: "Quản lý đơn hàng", icon: ShoppingCart, id: "orders" },
  { title: "Quản lý khách hàng", icon: Users, id: "customers" },
  { title: "Thông báo", icon: Bell, id: "notifications" },
  { title: "Lịch sử thanh toán", icon: CreditCard, id: "payments" },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState("dashboard")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = React.useState(false)
  const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = React.useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = React.useState(false)
  const [isEditSubCategoryOpen, setIsEditSubCategoryOpen] = React.useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = React.useState(false)
  const [isEditOrderOpen, setIsEditOrderOpen] = React.useState(false)
  const [isEditCustomerOpen, setIsEditCustomerOpen] = React.useState(false)
  const [isEditNotificationOpen, setIsEditNotificationOpen] = React.useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [categoryType, setCategoryType] = React.useState<"parent" | "sub">("parent")
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [deleteType, setDeleteType] = React.useState<string>("")
  const [itemToDelete, setItemToDelete] = React.useState<any>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Hoạt động", variant: "default" as const },
      inactive: { label: "Không hoạt động", variant: "secondary" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      processing: { label: "Đang xử lý", variant: "secondary" as const },
      shipped: { label: "Đã giao", variant: "outline" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
      failed: { label: "Thất bại", variant: "destructive" as const },
      pending: { label: "Đang xử lý", variant: "secondary" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Tổng quan về cửa hàng Gundam của bạn</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Number.parseInt(dashboardStats.totalRevenue))}</div>
            <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+5 sản phẩm mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.name}
                      className="w-10 h-10 rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Còn {product.stock} sản phẩm</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatCurrency(product.price)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h2>
          <p className="text-muted-foreground">Quản lý danh mục cha và danh mục con</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCategoryType("parent")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục cha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục cha mới</DialogTitle>
                <DialogDescription>Tạo danh mục cha mới cho sản phẩm</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent-category-name">Tên danh mục cha</Label>
                  <Input id="parent-category-name" placeholder="VD: Real Grade (RG)" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent-category-icon">Icon danh mục</Label>
                  <Input id="parent-category-icon" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">Chọn icon nhỏ cho danh mục (khuyến nghị 50x50px)</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent-category-image">Hình ảnh danh mục</Label>
                  <Input id="parent-category-image" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">
                    Chọn hình ảnh đại diện cho danh mục (khuyến nghị 200x200px)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm danh mục cha</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddSubCategoryOpen} onOpenChange={setIsAddSubCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCategoryType("sub")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục con
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục con mới</DialogTitle>
                <DialogDescription>Tạo danh mục con thuộc danh mục cha</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent-select">Danh mục cha</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id.toString()}>
                          {parent.icon} {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-name">Tên danh mục con</Label>
                  <Input id="sub-category-name" placeholder="VD: RG Gundam" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-description">Mô tả</Label>
                  <Textarea id="sub-category-description" placeholder="Mô tả danh mục con" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-image">Hình ảnh danh mục</Label>
                  <Input id="sub-category-image" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">Chọn hình ảnh đại diện cho danh mục con</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSubCategoryOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm danh mục con</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs để chuyển đổi giữa danh mục cha và con */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        <Button
          variant={categoryType === "parent" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCategoryType("parent")}
          className="flex-1"
        >
          Danh mục cha
        </Button>
        <Button
          variant={categoryType === "sub" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCategoryType("sub")}
          className="flex-1"
        >
          Danh mục con
        </Button>
      </div>

      {/* Hiển thị danh mục cha */}
      {categoryType === "parent" && (
        <Card>
          <CardHeader>
            <CardTitle>Danh mục cha</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Số danh mục con</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parentCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <img
                        src={category.iconImage || "/placeholder.svg"}
                        alt={`${category.name} icon`}
                        className="w-8 h-8 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{subCategories.filter((sub) => sub.parentId === category.id).length}</TableCell>
                    <TableCell>
                      {products.filter((p) => p.category.includes(category.name.split(" ")[0])).length}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(category)
                              setIsViewDetailsOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(category)
                              setIsEditCategoryOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setItemToDelete(category)
                              setDeleteType("danh mục cha")
                              setIsDeleteConfirmOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Hiển thị danh mục con */}
      {categoryType === "sub" && (
        <Card>
          <CardHeader>
            <CardTitle>Danh mục con</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên danh mục con</TableHead>
                  <TableHead>Danh mục cha</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCategories.map((subCategory) => (
                  <TableRow key={subCategory.id}>
                    <TableCell>
                      <img
                        src={subCategory.image || "/placeholder.svg"}
                        alt={subCategory.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{subCategory.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            parentCategories.find((p) => p.id === subCategory.parentId)?.iconImage || "/placeholder.svg"
                          }
                          alt="Parent icon"
                          className="w-6 h-6 rounded object-cover"
                        />
                        <Badge variant="outline">{subCategory.parentName}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{subCategory.description}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 20) + 1}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(subCategory)
                              setIsViewDetailsOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(subCategory)
                              setIsEditSubCategoryOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setItemToDelete(subCategory)
                              setDeleteType("danh mục con")
                              setIsDeleteConfirmOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết {selectedItem?.parentName ? "danh mục con" : "danh mục cha"}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tên:</Label>
                <p className="font-medium">{selectedItem.name}</p>
              </div>
              {selectedItem.icon && (
                <div className="grid gap-2">
                  <Label>Icon:</Label>
                  <p className="text-2xl">{selectedItem.icon}</p>
                </div>
              )}
              {selectedItem.parentName && (
                <div className="grid gap-2">
                  <Label>Danh mục cha:</Label>
                  <Badge variant="outline">{selectedItem.parentName}</Badge>
                </div>
              )}
              <div className="grid gap-2">
                <Label>Mô tả:</Label>
                <p>{selectedItem.description}</p>
              </div>
              <div className="grid gap-2">
                <Label>ID:</Label>
                <p className="text-muted-foreground">{selectedItem.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa danh mục cha */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục cha</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Icon hiện tại</Label>
              <img
                src={selectedItem?.iconImage || "/placeholder.svg"}
                alt={`${selectedItem?.name} icon`}
                className="w-16 h-16 rounded object-cover"
              />
            </div>
            <div className="grid gap-2">
              <Label>Hình ảnh hiện tại</Label>
              <img
                src={selectedItem?.image || "/placeholder.svg"}
                alt={selectedItem?.name}
                className="w-24 h-24 rounded object-cover"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-parent-name">Tên danh mục cha</Label>
              <Input id="edit-parent-name" defaultValue={selectedItem?.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-parent-icon">Thay đổi icon</Label>
              <Input id="edit-parent-icon" type="file" accept="image/*" />
              <p className="text-sm text-muted-foreground">Để trống nếu không muốn thay đổi</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-parent-image">Thay đổi hình ảnh</Label>
              <Input id="edit-parent-image" type="file" accept="image/*" />
              <p className="text-sm text-muted-foreground">Để trống nếu không muốn thay đổi</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa danh mục con */}
      <Dialog open={isEditSubCategoryOpen} onOpenChange={setIsEditSubCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục con</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Hình ảnh hiện tại</Label>
              <img
                src={selectedItem?.image || "/placeholder.svg"}
                alt={selectedItem?.name}
                className="w-24 h-24 rounded object-cover"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-parent-select">Danh mục cha</Label>
              <Select defaultValue={selectedItem?.parentId?.toString()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id.toString()}>
                      {parent.icon} {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sub-name">Tên danh mục con</Label>
              <Input id="edit-sub-name" defaultValue={selectedItem?.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sub-description">Mô tả</Label>
              <Textarea id="edit-sub-description" defaultValue={selectedItem?.description} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sub-image">Thay đổi hình ảnh</Label>
              <Input id="edit-sub-image" type="file" accept="image/*" />
              <p className="text-sm text-muted-foreground">Để trống nếu không muốn thay đổi</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSubCategoryOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
          <p className="text-muted-foreground">Quản lý tất cả sản phẩm Gundam</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogDescription>Thêm sản phẩm Gundam mới vào cửa hàng</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-name">Tên sản phẩm</Label>
                    <Input id="product-name" placeholder="VD: RG RX-78-2 Gundam" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-category">Danh mục</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rg">Real Grade (RG)</SelectItem>
                        <SelectItem value="mg">Master Grade (MG)</SelectItem>
                        <SelectItem value="pg">Perfect Grade (PG)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-price">Giá (VNĐ)</Label>
                    <Input id="product-price" type="number" placeholder="650000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-stock">Số lượng</Label>
                    <Input id="product-stock" type="number" placeholder="25" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-description">Mô tả</Label>
                  <Textarea id="product-description" placeholder="Mô tả chi tiết sản phẩm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-manufacturer">Nhà sản xuất</Label>
                    <Input id="product-manufacturer" placeholder="Bandai" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-scale">Tỷ lệ</Label>
                    <Input id="product-scale" placeholder="1/144" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm sản phẩm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Tìm kiếm sản phẩm..." className="max-w-sm" />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(product)
                            setIsViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(product)
                            setIsEditProductOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setItemToDelete(product)
                            setDeleteType("sản phẩm") // hoặc "đơn hàng", "khách hàng", "thông báo"
                            setIsDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Tìm kiếm đơn hàng..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="shipped">Đã giao</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Số sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(order)
                            setIsViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(order)
                            setIsEditOrderOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Cập nhật trạng thái
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          In hóa đơn
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setItemToDelete(order)
                            setDeleteType("đơn hàng")
                            setIsDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hủy đơn hàng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
          <p className="text-muted-foreground">Thông tin và lịch sử khách hàng</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất danh sách
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Tìm kiếm khách hàng..." className="max-w-sm" />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Tổng đơn hàng</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32&text=${customer.username[0].toUpperCase()}`}
                        />
                        <AvatarFallback>{customer.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.username}</p>
                        <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.gender}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{customer.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(customer)
                            setIsViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(customer)
                            setIsEditCustomerOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Lịch sử đơn hàng
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Gửi thông báo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setItemToDelete(customer)
                            setDeleteType("khách hàng")
                            setIsDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Khóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý thông báo</h2>
          <p className="text-muted-foreground">Gửi và theo dõi thông báo</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo thông báo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian gửi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      <span className={notification.isRead ? "text-muted-foreground" : "font-medium"}>
                        {notification.message}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.isRead ? "secondary" : "default"}>
                      {notification.isRead ? "Đã đọc" : "Chưa đọc"}
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.sentAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(notification)
                            setIsViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(notification)
                            setIsEditNotificationOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Gửi lại
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setItemToDelete(notification)
                            setDeleteType("thông báo")
                            setIsDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lịch sử thanh toán</h2>
          <p className="text-muted-foreground">Theo dõi các giao dịch thanh toán</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Tìm kiếm giao dịch..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Phương thức" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="vnpay">VNPay</SelectItem>
            <SelectItem value="momo">MoMo</SelectItem>
            <SelectItem value="zalopay">ZaloPay</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="completed">Thành công</SelectItem>
            <SelectItem value="failed">Thất bại</SelectItem>
            <SelectItem value="pending">Đang xử lý</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentLogs.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.transactionId}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.method}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.paidAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(payment)
                            setIsViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Tải biên lai
                        </DropdownMenuItem>
                        {payment.status === "failed" && (
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Thử lại thanh toán
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "categories":
        return renderCategories()
      case "products":
        return renderProducts()
      case "orders":
        return renderOrders()
      case "customers":
        return renderCustomers()
      case "notifications":
        return renderNotifications()
      case "payments":
        return renderPayments()
      default:
        return renderDashboard()
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Gundam Store</span>
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
                      <SidebarMenuButton onClick={() => setActiveTab(item.id)} isActive={activeTab === item.id}>
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
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <span>Admin</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-(--radix-popper-anchor-width)">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32&text=A" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
        </SidebarInset>
      </div>
      {/* Dialog chỉnh sửa sản phẩm */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-product-name">Tên sản phẩm</Label>
                <Input id="edit-product-name" defaultValue={selectedItem?.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-product-category">Danh mục</Label>
                <Select defaultValue={selectedItem?.category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Real Grade">Real Grade (RG)</SelectItem>
                    <SelectItem value="Master Grade">Master Grade (MG)</SelectItem>
                    <SelectItem value="Perfect Grade">Perfect Grade (PG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-product-price">Giá (VNĐ)</Label>
                <Input id="edit-product-price" type="number" defaultValue={selectedItem?.price} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-product-stock">Số lượng</Label>
                <Input id="edit-product-stock" type="number" defaultValue={selectedItem?.stock} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-product-status">Trạng thái</Label>
              <Select defaultValue={selectedItem?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa đơn hàng */}
      <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Mã đơn hàng:</Label>
              <p className="font-medium">{selectedItem?.id}</p>
            </div>
            <div className="grid gap-2">
              <Label>Khách hàng:</Label>
              <p>{selectedItem?.customer}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-order-status">Trạng thái</Label>
              <Select defaultValue={selectedItem?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đã giao</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order-note">Ghi chú</Label>
              <Textarea id="order-note" placeholder="Ghi chú về đơn hàng..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOrderOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa khách hàng */}
      <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-customer-username">Tên đăng nhập</Label>
              <Input id="edit-customer-username" defaultValue={selectedItem?.username} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-customer-email">Email</Label>
              <Input id="edit-customer-email" type="email" defaultValue={selectedItem?.email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-customer-gender">Giới tính</Label>
              <Select defaultValue={selectedItem?.gender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tổng đơn hàng:</Label>
              <p className="font-medium">{selectedItem?.totalOrders}</p>
            </div>
            <div className="grid gap-2">
              <Label>Tổng chi tiêu:</Label>
              <p className="font-medium">{selectedItem?.totalSpent && formatCurrency(selectedItem.totalSpent)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCustomerOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa thông báo */}
      <Dialog open={isEditNotificationOpen} onOpenChange={setIsEditNotificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-notification-message">Nội dung thông báo</Label>
              <Textarea id="edit-notification-message" defaultValue={selectedItem?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notification-status">Trạng thái</Label>
              <Select defaultValue={selectedItem?.isRead ? "read" : "unread"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">Chưa đọc</SelectItem>
                  <SelectItem value="read">Đã đọc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Thời gian gửi:</Label>
              <p className="text-muted-foreground">{selectedItem?.sentAt}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNotificationOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem chi tiết universal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết{" "}
              {selectedItem?.customer
                ? "đơn hàng"
                : selectedItem?.username
                  ? "khách hàng"
                  : selectedItem?.message
                    ? "thông báo"
                    : selectedItem?.transactionId
                      ? "giao dịch"
                      : selectedItem?.parentName
                        ? "danh mục con"
                        : selectedItem?.icon
                          ? "danh mục cha"
                          : "sản phẩm"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            {selectedItem &&
              Object.entries(selectedItem).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}:</Label>
                  <div className="col-span-2">
                    {key === "thumbnail" && value ? (
                      <img src={(value as string) || "/placeholder.svg"} alt="Product" className="w-16 h-16 rounded" />
                    ) : key.includes("price") || key.includes("amount") || key.includes("total") ? (
                      <p className="font-medium">{formatCurrency(Number(value))}</p>
                    ) : key.includes("status") ? (
                      getStatusBadge(value as string)
                    ) : (
                      <p className={key === "id" ? "text-muted-foreground" : ""}>{String(value)}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chi tiết thanh toán */}
      <Dialog open={isViewDetailsOpen && selectedItem?.transactionId} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch thanh toán</DialogTitle>
          </DialogHeader>
          {selectedItem?.transactionId && (
            <div className="grid gap-6 py-4">
              {/* Thông tin giao dịch */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin giao dịch</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mã giao dịch</Label>
                    <p className="font-mono text-sm">{selectedItem.transactionId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mã đơn hàng</Label>
                    <p className="font-medium">{selectedItem.orderId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</Label>
                    <Badge variant="outline">{selectedItem.method}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Thời gian thanh toán</Label>
                    <p>{selectedItem.paidAt}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                    <p className="text-sm">{selectedItem.description}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tên khách hàng</Label>
                    <p className="font-medium">{selectedItem.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p>{selectedItem.customerEmail}</p>
                  </div>
                  {selectedItem.phoneNumber && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
                      <p>{selectedItem.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin tài chính */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin tài chính</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Số tiền gốc</Label>
                    <p className="font-medium text-lg">{formatCurrency(selectedItem.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phí giao dịch</Label>
                    <p className="text-red-600">-{formatCurrency(selectedItem.fee)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Số tiền thực nhận</Label>
                    <p className="font-medium text-lg text-green-600">{formatCurrency(selectedItem.netAmount)}</p>
                  </div>
                  {selectedItem.bankCode && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Ngân hàng</Label>
                      <p>{selectedItem.bankCode}</p>
                    </div>
                  )}
                  {selectedItem.cardType && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Loại thẻ</Label>
                      <p>{selectedItem.cardType}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin lỗi (nếu có) */}
              {selectedItem.status === "failed" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">Thông tin lỗi</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Mã lỗi</Label>
                        <p className="font-mono text-sm text-red-600">{selectedItem.errorCode}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Mô tả lỗi</Label>
                        <p className="text-red-600">{selectedItem.errorMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Đóng
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Tải biên lai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa {deleteType} "{itemToDelete?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Xử lý xóa ở đây
                console.log(`Xóa ${deleteType}:`, itemToDelete)
                setIsDeleteConfirmOpen(false)
                setItemToDelete(null)
                setDeleteType("")
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
