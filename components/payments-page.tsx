"use client"

import * as React from "react"
import { Eye, MoreHorizontal, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
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

export function PaymentsPage() {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { label: "Thành công", variant: "default" as const },
      failed: { label: "Thất bại", variant: "destructive" as const },
      pending: { label: "Đang xử lý", variant: "secondary" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  return (
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog chi tiết thanh toán */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch thanh toán</DialogTitle>
          </DialogHeader>
          {selectedItem && (
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
    </div>
  )
}
