"use client";

import * as React from "react";
import {
  MoreHorizontal,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  CreditCard,
  Smartphone,
  Banknote,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import các function payment và WebSocket
import {
  getPaymentLogs,
  getPaymentLogsByStatus,
  markOrderAsPaid,
  markOrderAsFailed,
} from "@/hooks/Payment/Payment";
import { webSocketService } from "@/lib/websocket";

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
];

export function PaymentsPage() {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [payments, setPayments] = React.useState<typeof paymentLogs>([]);
  const [loading, setLoading] = React.useState(false);
  const [methodFilter, setMethodFilter] = React.useState("VNPay"); // Mặc định là VNPay
  const [statusFilter, setStatusFilter] = React.useState("all"); // Mặc định là tất cả trạng thái
  const [currentPage, setCurrentPage] = React.useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = React.useState(0); // Tổng số trang
  const [pageSize] = React.useState(10); // Số lượng bản ghi trên mỗi trang

  // WebSocket states
  const [wsConnected, setWsConnected] = React.useState(false);
  const [processingPayments, setProcessingPayments] = React.useState<Set<string>>(
    new Set()
  );

  // WebSocket connection
  React.useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect();
        setWsConnected(true);
        console.log("WebSocket connected successfully");
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        setWsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      webSocketService.disconnect();
      setWsConnected(false);
    };
  }, []);

  // Load payments data
  React.useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        let data;
        if (statusFilter === "all") {
          if (methodFilter === "all") {
            // Lấy danh sách thanh toán cho tất cả phương thức
            data = await getPaymentLogs("all", currentPage, pageSize);
          } else {
            // Lấy danh sách thanh toán theo phương thức cụ thể
            data = await getPaymentLogs(methodFilter, currentPage, pageSize);
          }
        } else {
          if (methodFilter === "all") {
            // Lấy danh sách thanh toán cho tất cả phương thức và trạng thái
            data = await getPaymentLogsByStatus(
              "all",
              statusFilter,
              currentPage,
              pageSize
            );
          } else {
            // Lấy danh sách thanh toán theo phương thức và trạng thái cụ thể
            data = await getPaymentLogsByStatus(
              methodFilter,
              statusFilter,
              currentPage,
              pageSize
            );
          }
        }
        setPayments(data.content || []); // Nếu API trả về `content` trong pagination
        setTotalPages(data.totalPages || 0); // Cập nhật tổng số trang
      } catch (error) {
        console.error("Error fetching payments:", error);
        alert("Không thể tải danh sách thanh toán!");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [methodFilter, statusFilter, currentPage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { label: "Thành công", variant: "default" as const },
      failed: { label: "Thất bại", variant: "destructive" as const },
      pending: { label: "Đang xử lý", variant: "secondary" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "secondary" as const,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleViewDetails = (payment: any) => {
    setSelectedItem(payment);
    setIsViewDetailsOpen(true);
  };

  const handleDownloadReceipt = (payment: any) => {
    console.log("Downloading receipt for:", payment);
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (payment: any) => {
    if (!payment.orderId) {
      alert("Không có mã đơn hàng để xử lý!");
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc chắn muốn đánh dấu đơn hàng ${payment.orderId} là đã thanh toán?`
    );
    if (!confirmed) return;

    try {
      setProcessingPayments((prev) => new Set(prev).add(payment.orderId));

      // Subscribe to WebSocket for this order
      const unsubscribe = webSocketService.subscribeToPaymentResult(
        payment.orderId,
        (status) => {
          console.log(
            `Payment status updated: ${status} for order: ${payment.orderId}`
          );

          // Update payment status in the list
          setPayments((prevPayments) =>
            prevPayments.map((p) =>
              p.orderId === payment.orderId
                ? { ...p, status: status.toLowerCase() === "confirmed" ? "completed" : status.toLowerCase() }
                : p
            )
          );

          setProcessingPayments((prev) => {
            const newSet = new Set(prev);
            newSet.delete(payment.orderId);
            return newSet;
          });

          // Auto unsubscribe after receiving result
          setTimeout(unsubscribe, 1000);
        }
      );

      // Call API to mark as paid
      await markOrderAsPaid(payment.orderId);
      alert("Đã gửi yêu cầu đánh dấu thanh toán thành công!");
    } catch (error) {
      console.error("Error marking payment as paid:", error);
      alert("Lỗi khi đánh dấu thanh toán!");

      setProcessingPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(payment.orderId);
        return newSet;
      });
    }
  };

  // Handle mark as failed
  const handleMarkAsFailed = async (payment: any) => {
    if (!payment.orderId) {
      alert("Không có mã đơn hàng để xử lý!");
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc chắn muốn đánh dấu đơn hàng ${payment.orderId} là thất bại?`
    );
    if (!confirmed) return;

    try {
      setProcessingPayments((prev) => new Set(prev).add(payment.orderId));

      // Subscribe to WebSocket for this order
      const unsubscribe = webSocketService.subscribeToPaymentResult(
        payment.orderId,
        (status) => {
          console.log(
            `Payment status updated: ${status} for order: ${payment.orderId}`
          );

          // Update payment status in the list
          setPayments((prevPayments) =>
            prevPayments.map((p) =>
              p.orderId === payment.orderId
                ? { ...p, status: status.toLowerCase() }
                : p
            )
          );

          setProcessingPayments((prev) => {
            const newSet = new Set(prev);
            newSet.delete(payment.orderId);
            return newSet;
          });

          // Auto unsubscribe after receiving result
          setTimeout(unsubscribe, 1000);
        }
      );

      // Call API to mark as failed
      await markOrderAsFailed(payment.orderId);
      alert("Đã gửi yêu cầu đánh dấu thanh toán thất bại!");
    } catch (error) {
      console.error("Error marking payment as failed:", error);
      alert("Lỗi khi đánh dấu thanh toán!");

      setProcessingPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(payment.orderId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Lịch sử thanh toán
          </h2>
          <p className="text-muted-foreground">
            Theo dõi các giao dịch thanh toán
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* WebSocket status indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100">
            {wsConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">
                  Disconnected
                </span>
              </>
            )}
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Tìm kiếm giao dịch..." className="max-w-sm" />
        <div className="flex gap-4 mb-6">
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="VNPay">VNPay</SelectItem>
              <SelectItem value="COD">COD</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="FAILED">Thất bại</SelectItem>
              <SelectItem value="PENDING">Đang chờ</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Không có giao dịch nào
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment, index) => (
                  <TableRow key={payment.id || index}>
                    <TableCell className="font-medium">
                      {payment.transactionId || "Không có mã giao dịch"}
                    </TableCell>
                    <TableCell>{payment.orderId}</TableCell>
                    <TableCell>
                      {payment.customerName || "Không có tên khách hàng"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.method === "VNPay" && (
                          <CreditCard className="h-4 w-4" />
                        )}
                        {payment.method === "MoMo" && (
                          <Smartphone className="h-4 w-4" />
                        )}
                        {payment.method === "COD" && <Banknote className="h-4 w-4" />}
                        <Badge variant="outline">{payment.method}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(payment.status)}
                        {processingPayments.has(payment.orderId) && (
                          <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleString("vi-VN")
                        : "Không có thời gian thanh toán"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>

                          {/* Payment action buttons */}
                          {payment.status !== "completed" &&
                            payment.status !== "failed" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleMarkAsPaid(payment)}
                                  disabled={processingPayments.has(payment.orderId)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Đánh dấu đã thanh toán
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleMarkAsFailed(payment)}
                                  disabled={processingPayments.has(payment.orderId)}
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Đánh dấu thất bại
                                </DropdownMenuItem>
                              </>
                            )}

                          <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                            <Download className="mr-2 h-4 w-4" />
                            Tải biên lai
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-4 mt-6 py-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          ← Trước
        </Button>

        <span className="text-sm text-gray-600">
          Trang {currentPage + 1} / {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
          }
          disabled={currentPage >= totalPages - 1}
        >
          Sau →
        </Button>
      </div>

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
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mã giao dịch
                    </Label>
                    <p className="font-mono text-sm">
                      {selectedItem.transactionId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mã đơn hàng
                    </Label>
                    <p className="font-medium">{selectedItem.orderId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phương thức thanh toán
                    </Label>
                    <Badge variant="outline">{selectedItem.method}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </Label>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Thời gian thanh toán
                    </Label>
                    <p>{selectedItem.paidAt}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mô tả
                    </Label>
                    <p className="text-sm">{selectedItem.description}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tên khách hàng
                    </Label>
                    <p className="font-medium">{selectedItem.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p>{selectedItem.customerEmail}</p>
                  </div>
                  {selectedItem.phoneNumber && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Số điện thoại
                      </Label>
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
                    <Label className="text-sm font-medium text-muted-foreground">
                      Số tiền gốc
                    </Label>
                    <p className="font-medium text-lg">
                      {formatCurrency(selectedItem.amount)}
                    </p>
                  </div>
                  {/* Chỉ hiển thị phí giao dịch nếu hợp lệ */}
                  {selectedItem.fee && !isNaN(selectedItem.fee) && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phí giao dịch
                      </Label>
                      <p className="text-red-600">
                        -{formatCurrency(selectedItem.fee)}
                      </p>
                    </div>
                  )}
                  {/* Chỉ hiển thị số tiền thực nhận nếu hợp lệ */}
                  {selectedItem.netAmount && !isNaN(selectedItem.netAmount) && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Số tiền thực nhận
                      </Label>
                      <p className="font-medium text-lg text-green-600">
                        {formatCurrency(selectedItem.netAmount)}
                      </p>
                    </div>
                  )}
                  {selectedItem.bankCode && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Ngân hàng
                      </Label>
                      <p>{selectedItem.bankCode}</p>
                    </div>
                  )}
                  {selectedItem.cardType && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Loại thẻ
                      </Label>
                      <p>{selectedItem.cardType}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin lỗi (nếu có) */}
              {selectedItem.status === "failed" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">
                    Thông tin lỗi
                  </h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Mã lỗi
                        </Label>
                        <p className="font-mono text-sm text-red-600">
                          {selectedItem.errorCode}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Mô tả lỗi
                        </Label>
                        <p className="text-red-600">
                          {selectedItem.errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDetailsOpen(false)}
            >
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
  );
}
