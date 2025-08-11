"use client"

import * as React from "react"
import { Edit, Eye, MoreHorizontal, Download, Search, ShoppingCart, Bell, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock data
const customers = [
  {
    id: 1,
    username: "nguyenvana",
    email: "nguyenvana@email.com",
    fullName: "Nguyễn Văn A",
    phone: "0987654321",
    gender: "Nam",
    birthDate: "1990-05-15",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    totalOrders: 5,
    totalSpent: 8500000,
    joinDate: "2023-06-15",
    status: "active",
    lastLogin: "2024-01-15 10:30",
    orders: [
      { id: "ORD001", date: "2024-01-15", total: 1850000, status: "completed" },
      { id: "ORD005", date: "2024-01-10", total: 650000, status: "completed" },
    ],
  },
  {
    id: 2,
    username: "tranthib",
    email: "tranthib@email.com",
    fullName: "Trần Thị B",
    phone: "0912345678",
    gender: "Nữ",
    birthDate: "1995-08-22",
    address: "456 Lê Văn Việt, Quận 9, TP.HCM",
    totalOrders: 3,
    totalSpent: 2100000,
    joinDate: "2023-08-22",
    status: "active",
    lastLogin: "2024-01-14 15:20",
    orders: [{ id: "ORD002", date: "2024-01-14", total: 650000, status: "processing" }],
  },
  {
    id: 3,
    username: "levanc",
    email: "levanc@email.com",
    fullName: "Lê Văn C",
    phone: "0901234567",
    gender: "Nam",
    birthDate: "1988-12-03",
    address: "789 Võ Văn Tần, Quận 3, TP.HCM",
    totalOrders: 1,
    totalSpent: 3500000,
    joinDate: "2023-12-01",
    status: "locked",
    lastLogin: "2024-01-13 14:20",
    orders: [{ id: "ORD003", date: "2024-01-13", total: 3500000, status: "shipped" }],
  },
]

export function CustomersPage() {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false)
  const [isEditCustomerOpen, setIsEditCustomerOpen] = React.useState(false)
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = React.useState(false)
  const [isSendNotificationOpen, setIsSendNotificationOpen] = React.useState(false)
  const [isLockConfirmOpen, setIsLockConfirmOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [itemToLock, setItemToLock] = React.useState<any>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Hoạt động", variant: "default" as const },
      locked: { label: "Đã khóa", variant: "destructive" as const },
      inactive: { label: "Không hoạt động", variant: "secondary" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  return (
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
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead>Trạng thái</TableHead>
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
                        <p className="font-medium">{customer.fullName}</p>
                        <p className="text-sm text-muted-foreground">@{customer.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.gender}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(customer)
                            setIsOrderHistoryOpen(true)
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Lịch sử đơn hàng
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(customer)
                            setIsSendNotificationOpen(true)
                          }}
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Gửi thông báo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setItemToLock(customer)
                            setIsLockConfirmOpen(true)
                          }}
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          {customer.status === "locked" ? "Mở khóa" : "Khóa tài khoản"}
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

      {/* Dialog xem chi tiết khách hàng */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Thông tin cá nhân */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Họ và tên</Label>
                    <p className="font-medium">{selectedItem.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tên đăng nhập</Label>
                    <p>@{selectedItem.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p>{selectedItem.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
                    <p>{selectedItem.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Giới tính</Label>
                    <p>{selectedItem.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ngày sinh</Label>
                    <p>{selectedItem.birthDate}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Địa chỉ</Label>
                    <p>{selectedItem.address}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin tài khoản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin tài khoản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ngày tham gia</Label>
                    <p>{selectedItem.joinDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Lần đăng nhập cuối</Label>
                    <p>{selectedItem.lastLogin}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ID khách hàng</Label>
                    <p className="text-muted-foreground">{selectedItem.id}</p>
                  </div>
                </div>
              </div>

              {/* Thống kê mua hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thống kê mua hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</Label>
                    <p className="text-2xl font-bold">{selectedItem.totalOrders}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tổng chi tiêu</Label>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedItem.totalSpent)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa khách hàng */}
      <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho khách hàng {selectedItem?.fullName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-fullname">Họ và tên</Label>
                <Input id="edit-customer-fullname" defaultValue={selectedItem?.fullName} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-username">Tên đăng nhập</Label>
                <Input id="edit-customer-username" defaultValue={selectedItem?.username} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-email">Email</Label>
                <Input id="edit-customer-email" type="email" defaultValue={selectedItem?.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-phone">Số điện thoại</Label>
                <Input id="edit-customer-phone" defaultValue={selectedItem?.phone} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="edit-customer-birthdate">Ngày sinh</Label>
                <Input id="edit-customer-birthdate" type="date" defaultValue={selectedItem?.birthDate} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-customer-address">Địa chỉ</Label>
              <Textarea id="edit-customer-address" defaultValue={selectedItem?.address} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-customer-status">Trạng thái tài khoản</Label>
              <Select defaultValue={selectedItem?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="locked">Đã khóa</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCustomerOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={() => {
                console.log("Cập nhật khách hàng:", selectedItem)
                setIsEditCustomerOpen(false)
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog lịch sử đơn hàng */}
      <Dialog open={isOrderHistoryOpen} onOpenChange={setIsOrderHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lịch sử đơn hàng - {selectedItem?.fullName}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItem.orders?.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                          {order.status === "completed"
                            ? "Hoàn thành"
                            : order.status === "processing"
                              ? "Đang xử lý"
                              : "Đã giao"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsOrderHistoryOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog gửi thông báo */}
      <Dialog open={isSendNotificationOpen} onOpenChange={setIsSendNotificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gửi thông báo</DialogTitle>
            <DialogDescription>Gửi thông báo đến khách hàng {selectedItem?.fullName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notification-title">Tiêu đề thông báo</Label>
              <Input id="notification-title" placeholder="Nhập tiêu đề thông báo" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notification-content">Nội dung thông báo</Label>
              <Textarea id="notification-content" placeholder="Nhập nội dung thông báo..." rows={4} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notification-type">Loại thông báo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại thông báo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotion">Khuyến mãi</SelectItem>
                  <SelectItem value="order">Đơn hàng</SelectItem>
                  <SelectItem value="account">Tài khoản</SelectItem>
                  <SelectItem value="general">Thông báo chung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendNotificationOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                console.log("Gửi thông báo đến:", selectedItem)
                setIsSendNotificationOpen(false)
              }}
            >
              Gửi thông báo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận khóa/mở khóa tài khoản */}
      <Dialog open={isLockConfirmOpen} onOpenChange={setIsLockConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {itemToLock?.status === "locked" ? "Xác nhận mở khóa" : "Xác nhận khóa tài khoản"}
            </DialogTitle>
            <DialogDescription>
              {itemToLock?.status === "locked"
                ? `Bạn có chắc chắn muốn mở khóa tài khoản của "${itemToLock?.fullName}"?`
                : `Bạn có chắc chắn muốn khóa tài khoản của "${itemToLock?.fullName}"? Khách hàng sẽ không thể đăng nhập và mua hàng.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLockConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant={itemToLock?.status === "locked" ? "default" : "destructive"}
              onClick={() => {
                console.log(itemToLock?.status === "locked" ? "Mở khóa" : "Khóa tài khoản:", itemToLock)
                setIsLockConfirmOpen(false)
                setItemToLock(null)
              }}
            >
              {itemToLock?.status === "locked" ? "Mở khóa" : "Khóa tài khoản"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
