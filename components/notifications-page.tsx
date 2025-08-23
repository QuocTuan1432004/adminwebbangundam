"use client";

import * as React from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Import thêm WebSocket
import { orderApi, OrderNotificationData } from "@/hooks/Order/Order.ts";
import { AdminAuthService } from "@/hooks/user/userAuth";
import { webSocketService } from "@/lib/websocket";

// Interface cho notification item
interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  recipient: string;
  recipientName: string;
  recipientEmail: string;
  isRead: boolean;
  sentAt: string;
  status: string;
  priority: string;
  orderId?: string;
}

export function NotificationsPage() {
  // State cho notifications
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // WebSocket states
  const [wsConnected, setWsConnected] = React.useState(false);

  // WebSocket connection
  React.useEffect(() => {
    const connectWebSocket = async () => {
      try {
        console.log('🚀 Notifications: Connecting to WebSocket...');
        await webSocketService.connect();
        setWsConnected(true);
        console.log('✅ Notifications: WebSocket connected successfully');
      } catch (error) {
        console.error('❌ Notifications: Failed to connect WebSocket:', error);
        setWsConnected(false);
      }
    };

    connectWebSocket();

    // Subscribe to connection status changes
    const unsubscribeStatus = webSocketService.onConnectionStatusChange((connected) => {
      setWsConnected(connected);
      console.log(`🔄 Notifications: WebSocket status changed to ${connected ? 'Connected' : 'Disconnected'}`);
    });

    // Cleanup
    return () => {
      unsubscribeStatus();
      webSocketService.disconnect();
    };
  }, []);

  // Subscribe to payment notifications via WebSocket
  React.useEffect(() => {
    if (!wsConnected) return;

    console.log('🔔 Setting up notifications subscription...');

    const unsubscribe = webSocketService.subscribeToNotifications((notificationData) => {
      try {
        console.log('📨 Processing notification data:', notificationData);
        
        const newNotification: NotificationItem = {
          id: Date.now(),
          title: "Thanh toán thành công",
          message: `Đơn hàng ${notificationData.orderId} đã được thanh toán thành công với số tiền ${formatCurrency(notificationData.amount)}`,
          type: "order",
          recipient: "specific",
          recipientName: notificationData.customerName || "Khách hàng",
          recipientEmail: notificationData.customerEmail || "",
          isRead: false,
          sentAt: new Date().toLocaleString('vi-VN'),
          status: "sent",
          priority: "normal",
          orderId: notificationData.orderId,
        };

        setNotifications(prev => [newNotification, ...prev]);
        
        if (Notification.permission === "granted") {
          new Notification("Thanh toán mới", {
            body: `Đơn hàng ${notificationData.orderId} đã được thanh toán thành công`,
            icon: "/favicon.ico"
          });
        }
        
      } catch (error) {
        console.error('❌ Error processing payment notification:', error);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [wsConnected]);

  // Convert PaymentLog data to notification format
  const convertPaymentLogToNotification = (paymentLog: OrderNotificationData, index: number): NotificationItem => {
    return {
      id: 2000 + index,
      title: "Thanh toán thành công",
      message: `Đơn hàng ${paymentLog.orderId} đã được thanh toán thành công qua ${paymentLog.method} với số tiền ${formatCurrency(paymentLog.totalAmount)}${paymentLog.transactionId ? ` - Mã GD: ${paymentLog.transactionId}` : ''}`,
      type: "order",
      recipient: "specific",
      recipientName: paymentLog.customerName,
      recipientEmail: paymentLog.customerEmail,
      isRead: false,
      sentAt: paymentLog.paidAt ? new Date(paymentLog.paidAt).toLocaleString('vi-VN') : new Date(paymentLog.createdAt).toLocaleString('vi-VN'),
      status: "sent",
      priority: "normal",
      orderId: paymentLog.orderId,
    }
  }

  // Fetch paid orders
  React.useEffect(() => {
    const fetchPaidOrdersFromPaymentLogs = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = AdminAuthService.getToken();
        if (!token) {
          setError("Không có token xác thực");
          setNotifications([]);
          setLoading(false);
          return;
        }

        console.log("🔄 Fetching paid orders for notifications...");
        const response = await orderApi.getPaidOrdersForNotifications(token);
        
        if (response.result && Array.isArray(response.result) && response.result.length > 0) {
          console.log("✅ Paid orders found:", response.result.length);
          
          const paymentNotifications = response.result.map((order, index) => 
            convertPaymentLogToNotification(order, index)
          );
          
          // ✅ Chỉ dùng real data từ API
          paymentNotifications.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
          
          setNotifications(paymentNotifications);
          console.log("🎯 Final notifications:", paymentNotifications.length);
        } else {
          console.log("⚠️ No confirmed payments found");
          setNotifications([]); // ✅ Không có data thì để trống
          // ❌ Không set error nữa, để trống thay vì hiển thị lỗi
        }
      } catch (err) {
        console.error("❌ API Error:", err);
        setError(`Lỗi kết nối API: ${err.message}`);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaidOrdersFromPaymentLogs();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

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

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý thông báo</h2>
            <p className="text-muted-foreground">Gửi và theo dõi thông báo đến khách hàng</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
              <span>Đang tải thông báo...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý thông báo</h2>
          <p className="text-muted-foreground">Gửi và theo dõi thông báo đến khách hàng</p>
        </div>
      </div>

      {/* Error display - chỉ hiển thị lỗi API thực sự */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">❌ {error}</p>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {/* ✅ Hiển thị empty state nếu không có notifications */}
          {notifications.length === 0 && !loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Chưa có thông báo thanh toán nào</p>
              <p className="text-xs text-muted-foreground mt-2">Thông báo sẽ xuất hiện khi có đơn hàng được thanh toán thành công</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian gửi</TableHead>
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
                          {notification.orderId && (
                            <p className="text-xs text-blue-600">#{notification.orderId}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{notification.recipientName}</span>
                    </TableCell>
                    <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                    <TableCell>{notification.sentAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}