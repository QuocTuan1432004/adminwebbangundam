"use client"

import * as React from "react"
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Bell, Send, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Checkbox } from "@/components/ui/checkbox"

// Mock data
const notifications = [
  {
    id: 1,
    title: "Thanh toán thành công",
    message: "Đơn hàng ORD001 đã được thanh toán",
    type: "order",
    recipient: "specific",
    recipientName: "Nguyễn Văn A",
    recipientEmail: "nguyenvana@email.com",
    isRead: false,
    sentAt: "2024-01-15 10:30",
    status: "sent",
    priority: "normal",
  },
  {
    id: 2,
    title: "Sản phẩm sắp hết hàng",
    message: "Sản phẩm RG RX-78-2 sắp hết hàng, chỉ còn 5 sản phẩm",
    type: "inventory",
    recipient: "all",
    recipientName: "Tất cả khách hàng",
    recipientEmail: "",
    isRead: true,
    sentAt: "2024-01-14 15:45",
    status: "sent",
    priority: "high",
  },
  {
    id: 3,
    title: "Khuyến mãi cuối năm",
    message: "Giảm giá 20% cho tất cả sản phẩm Gundam trong tháng 12",
    type: "promotion",
    recipient: "all",
    recipientName: "Tất cả khách hàng",
    recipientEmail: "",
    isRead: false,
    sentAt: "2024-01-13 09:00",
    status: "draft",
    priority: "normal",
  },
]

export function NotificationsPage() {
  const [isCreateNotificationOpen, setIsCreateNotificationOpen] = React.useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false)
  const [isEditNotificationOpen, setIsEditNotificationOpen] = React.useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [itemToDelete, setItemToDelete] = React.useState<any>(null)

  const getStatusBadge = (status: string) => {
    const statusMap = {
      sent: { label: "Đã gửi", variant: "default" as const },
      draft: { label: "Bản nháp", variant: "secondary" as const },
      scheduled: { label: "Đã lên lịch", variant: "outline" as const },
      failed: { label: "Gửi thất bại", variant: "destructive" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      high: { label: "Cao", variant: "destructive" as const },
      normal: { label: "Bình thường", variant: "default" as const },
      low: { label: "Thấp", variant: "secondary" as const },
    }
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || {
      label: priority,
      variant: "secondary" as const,
    }
    return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const typeMap = {
      order: { label: "Đơn hàng", variant: "default" as const },
      promotion: { label: "Khuyến mãi", variant: "outline" as const },
      inventory: { label: "Kho hàng", variant: "secondary" as const },
      account: { label: "Tài khoản", variant: "outline" as const },
      general: { label: "Chung", variant: "secondary" as const },
    }
    const typeInfo = typeMap[type as keyof typeof typeMap] || { label: type, variant: "secondary" as const }
    return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý thông báo</h2>
          <p className="text-muted-foreground">Gửi và theo dõi thông báo đến khách hàng</p>
        </div>
        <Dialog open={isCreateNotificationOpen} onOpenChange={setIsCreateNotificationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo thông báo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo thông báo mới</DialogTitle>
              <DialogDescription>Tạo và gửi thông báo đến khách hàng</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="notification-title">Tiêu đề thông báo</Label>
                <Input id="notification-title" placeholder="Nhập tiêu đề thông báo" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notification-content">Nội dung thông báo</Label>
                <Textarea id="notification-content" placeholder="Nhập nội dung chi tiết thông báo..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="notification-type">Loại thông báo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotion">Khuyến mãi</SelectItem>
                      <SelectItem value="order">Đơn hàng</SelectItem>
                      <SelectItem value="inventory">Kho hàng</SelectItem>
                      <SelectItem value="account">Tài khoản</SelectItem>
                      <SelectItem value="general">Thông báo chung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notification-priority">Độ ưu tiên</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="normal">Bình thường</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Người nhận</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="all-customers" />
                    <Label htmlFor="all-customers">Gửi đến tất cả khách hàng</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="specific-customer" />
                    <Label htmlFor="specific-customer">Gửi đến khách hàng cụ thể</Label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-email">Email khách hàng (nếu gửi cụ thể)</Label>
                <Input id="customer-email" type="email" placeholder="customer@email.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="send-time">Thời gian gửi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Gửi ngay</SelectItem>
                    <SelectItem value="schedule">Lên lịch gửi</SelectItem>
                    <SelectItem value="draft">Lưu bản nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateNotificationOpen(false)}>
                Hủy
              </Button>
              <Button variant="outline">Lưu bản nháp</Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Gửi thông báo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Tìm kiếm thông báo..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="sent">Đã gửi</SelectItem>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="scheduled">Đã lên lịch</SelectItem>
            <SelectItem value="failed">Thất bại</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="promotion">Khuyến mãi</SelectItem>
            <SelectItem value="order">Đơn hàng</SelectItem>
            <SelectItem value="inventory">Kho hàng</SelectItem>
            <SelectItem value="account">Tài khoản</SelectItem>
            <SelectItem value="general">Chung</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Người nhận</TableHead>
                <TableHead>Độ ưu tiên</TableHead>
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
                      {!notification.isRead && notification.status === "sent" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{notification.message}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(notification.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {notification.recipient === "all" ? <Users className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      <span className="text-sm">{notification.recipientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
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
                        {notification.status === "draft" && (
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Gửi ngay
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Gửi lại
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setItemToDelete(notification)
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

      {/* Dialog xem chi tiết thông báo */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết thông báo</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tiêu đề</Label>
                    <p className="font-medium">{selectedItem.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ID thông báo</Label>
                    <p className="text-muted-foreground">{selectedItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Loại thông báo</Label>
                    {getTypeBadge(selectedItem.type)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Độ ưu tiên</Label>
                    {getPriorityBadge(selectedItem.priority)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Thời gian gửi</Label>
                    <p>{selectedItem.sentAt}</p>
                  </div>
                </div>
              </div>

              {/* Nội dung thông báo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nội dung thông báo</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p>{selectedItem.message}</p>
                </div>
              </div>

              {/* Thông tin người nhận */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin người nhận</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Loại người nhận</Label>
                    <div className="flex items-center space-x-2">
                      {selectedItem.recipient === "all" ? (
                        <>
                          <Users className="h-4 w-4" />
                          <span>Tất cả khách hàng</span>
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4" />
                          <span>Khách hàng cụ thể</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tên người nhận</Label>
                    <p>{selectedItem.recipientName}</p>
                  </div>
                  {selectedItem.recipientEmail && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">Email người nhận</Label>
                      <p>{selectedItem.recipientEmail}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trạng thái đọc */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Trạng thái đọc</h3>
                <Badge variant={selectedItem.isRead ? "secondary" : "default"}>
                  {selectedItem.isRead ? "Đã đọc" : "Chưa đọc"}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Đóng</Button>
            {selectedItem?.status === "draft" && (
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Gửi ngay
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa thông báo */}
      <Dialog open={isEditNotificationOpen} onOpenChange={setIsEditNotificationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
            <DialogDescription>Cập nhật thông tin thông báo "{selectedItem?.title}"</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-notification-title">Tiêu đề thông báo</Label>
              <Input id="edit-notification-title" defaultValue={selectedItem?.title} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notification-content">Nội dung thông báo</Label>
              <Textarea id="edit-notification-content" defaultValue={selectedItem?.message} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-notification-type">Loại thông báo</Label>
                <Select defaultValue={selectedItem?.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotion">Khuyến mãi</SelectItem>
                    <SelectItem value="order">Đơn hàng</SelectItem>
                    <SelectItem value="inventory">Kho hàng</SelectItem>
                    <SelectItem value="account">Tài khoản</SelectItem>
                    <SelectItem value="general">Thông báo chung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notification-priority">Độ ưu tiên</Label>
                <Select defaultValue={selectedItem?.priority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="normal">Bình thường</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notification-status">Trạng thái</Label>
              <Select defaultValue={selectedItem?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="sent">Đã gửi</SelectItem>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNotificationOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={() => {
                console.log("Cập nhật thông báo:", selectedItem)
                setIsEditNotificationOpen(false)
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa thông báo */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thông báo</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thông báo "{itemToDelete?.title}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("Xóa thông báo:", itemToDelete)
                setIsDeleteConfirmOpen(false)
                setItemToDelete(null)
              }}
            >
              Xóa thông báo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
