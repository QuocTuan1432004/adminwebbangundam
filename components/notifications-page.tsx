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
import { Button } from "@/components/ui/button";
import { Check, CheckCheck } from "lucide-react";

// Import API functions
import { 
  getAllNotifications, 
  markAsRead, 
  markAllAsRead,
  getUnreadNotificationCount,
  type Notification 
} from "@/hooks/notification/Notification";

// Import userApi để lấy thông tin user
import { userApi, type UserResponse } from "@/hooks/user/userApi";

export function NotificationsPage() {
  // State cho notifications
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [unreadCount, setUnreadCount] = React.useState(0);
  
  // State cho user info cache
  const [userCache, setUserCache] = React.useState<Record<string, UserResponse>>({});
  
  // State cho auto-refresh
  const [lastFetchTime, setLastFetchTime] = React.useState<Date>(new Date());
  const [isAutoRefreshing, setIsAutoRefreshing] = React.useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = React.useState(0);

  // Refs để tránh stale closure và infinite loops
  const notificationsRef = React.useRef<Notification[]>([]);
  const userCacheRef = React.useRef<Record<string, UserResponse>>({});

  // Update refs khi state thay đổi
  React.useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  React.useEffect(() => {
    userCacheRef.current = userCache;
  }, [userCache]);

  // Helper functions
  const isNotificationRead = (notification: Notification): boolean => {
    return notification.isRead === true;
  };

  const getUnreadNotifications = (notifications: Notification[]): Notification[] => {
    return notifications.filter(notification => !isNotificationRead(notification));
  };

  const countUnreadNotifications = (notifications: Notification[]): number => {
    return getUnreadNotifications(notifications).length;
  };

  // Function để load user info cho notifications mới (sử dụng ref)
  const loadUserInfoForNewNotifications = async (newNotifications: Notification[]) => {
    const uniqueUserIds = Array.from(new Set(newNotifications.map(n => n.userId)));
    const token = localStorage.getItem('admin_token');
    
    if (token && uniqueUserIds.length > 0) {
      const userInfoPromises = uniqueUserIds.map(async (userId) => {
        // Sử dụng ref thay vì state
        if (userCacheRef.current[userId]) return { userId, userInfo: userCacheRef.current[userId] };
        
        try {
          const response = await userApi.getUserById(token, userId);
          return { userId, userInfo: response.result };
        } catch (error) {
          console.error(`Error loading user ${userId}:`, error);
          return { userId, userInfo: null };
        }
      });

      const userInfoResults = await Promise.all(userInfoPromises);
      const newUserCache: Record<string, UserResponse> = {};
      
      userInfoResults.forEach(({ userId, userInfo }) => {
        if (userInfo) {
          newUserCache[userId] = userInfo;
        }
      });

      if (Object.keys(newUserCache).length > 0) {
        setUserCache(prev => ({ ...prev, ...newUserCache }));
      }
    }
  };

  // Function để kiểm tra thông báo mới (không có dependencies)
  const checkForNewNotifications = React.useCallback(async () => {
    try {
      setIsAutoRefreshing(true);
      
      const freshNotifications = await getAllNotifications();
      
      // Sử dụng ref để lấy current notifications
      const currentNotifications = notificationsRef.current;
      const currentIds = new Set(currentNotifications.map(n => n.id));
      const newNotifications = freshNotifications.filter(n => !currentIds.has(n.id));
      
      if (newNotifications.length > 0) {
        
        // Load user info cho notifications mới
        await loadUserInfoForNewNotifications(newNotifications);
        
        // Update notifications state
        setNotifications(prev => {
          const updated = [...newNotifications, ...prev];
          const newUnreadCount = countUnreadNotifications(updated);
          setUnreadCount(newUnreadCount);
          
          // Hiển thị toast notification
          setNewNotificationsCount(newNotifications.length);
          setTimeout(() => setNewNotificationsCount(0), 3000);
        
          return updated;
        });
      } else {
        // Kiểm tra read status changes
        const currentNotifications = notificationsRef.current;
        const updatedNotifications = currentNotifications.map(currentNotification => {
          const freshNotification = freshNotifications.find(n => n.id === currentNotification.id);
          if (freshNotification && freshNotification.isRead !== currentNotification.isRead) {
            return { ...currentNotification, isRead: freshNotification.isRead };
          }
          return currentNotification;
        });
        
        const hasReadStatusChange = updatedNotifications.some((n, index) => 
          n.isRead !== currentNotifications[index]?.isRead
        );
        
        if (hasReadStatusChange) {
          setNotifications(updatedNotifications);
          const newUnreadCount = countUnreadNotifications(updatedNotifications);
          setUnreadCount(newUnreadCount);
        }
      }
      
      setLastFetchTime(new Date());
      
    } catch (error) {
      console.error('❌ Error checking for new notifications:', error);
    } finally {
      setIsAutoRefreshing(false);
    }
  }, []); // EMPTY dependency array để tránh infinite loop

  // Load notifications lần đầu
  const loadNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const notificationsData = await getAllNotifications();
      
      setNotifications(notificationsData);
      
      const localUnreadCount = countUnreadNotifications(notificationsData);
      setUnreadCount(localUnreadCount);

      // Load user info cho tất cả notifications
      const uniqueUserIds = Array.from(new Set(notificationsData.map(n => n.userId)));
      const token = localStorage.getItem('admin_token');
      
      if (token && uniqueUserIds.length > 0) {
        const userInfoPromises = uniqueUserIds.map(async (userId) => {
          try {
            const response = await userApi.getUserById(token, userId);
            return { userId, userInfo: response.result };
          } catch (error) {
            console.error(`Error loading user ${userId}:`, error);
            return { userId, userInfo: null };
          }
        });

        const userInfoResults = await Promise.all(userInfoPromises);
        const newUserCache: Record<string, UserResponse> = {};
        
        userInfoResults.forEach(({ userId, userInfo }) => {
          if (userInfo) {
            newUserCache[userId] = userInfo;
          }
        });

        setUserCache(newUserCache);
      }
      
      setLastFetchTime(new Date());
      
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thông báo');
    } finally {
      setLoading(false);
    }
  }, []); // EMPTY dependency array

  // Setup auto-refresh interval (chỉ chạy 1 lần)
  React.useEffect(() => {
    // Load notifications lần đầu
    loadNotifications();

    // Setup interval để check mỗi 5 giây
    const intervalId = setInterval(() => {
      checkForNewNotifications();
    }, 5000);

    // Cleanup interval khi component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // EMPTY dependency array - chỉ chạy 1 lần

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) {
      console.error(`❌ Notification with ID ${notificationId} not found`);
      return;
    }

    if (isNotificationRead(notification)) {
      console.log(`ℹ️ Notification ${notificationId} already marked as read`);
      return;
    }

    try {
      console.log(`📖 Marking notification ${notificationId} as read...`);
      await markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => {
        const updated = prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        );
        
        const newUnreadCount = countUnreadNotifications(updated);
        setUnreadCount(newUnreadCount);
        return updated;
      });
      
    } catch (err) {
      console.error("❌ Error marking notification as read:", err);
      setError(err instanceof Error ? err.message : 'Lỗi khi đánh dấu đã đọc');
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = getUnreadNotifications(notifications);
    
    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      setLoading(true);
      console.log(`📖 Marking ${unreadNotifications.length} notifications as read...`);
      
      await markAllAsRead();
      
      setNotifications(prev => {
        const updated = prev.map(notification => ({ ...notification, isRead: true }));
        setUnreadCount(0);
        console.log(`✅ All notifications marked as read`);
        return updated;
      });
      
    } catch (err) {
      console.error("❌ Error marking all notifications as read:", err);
      setError(err instanceof Error ? err.message : 'Lỗi khi đánh dấu tất cả đã đọc');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render functions
  const renderUserInfo = (userId: string) => {
    const userInfo = userCache[userId];
    
    if (userInfo) {
      return (
        <div className="text-sm">
          <p className="font-medium text-gray-900">
            {userInfo.email}
          </p>
          <p className="text-muted-foreground text-xs">
            ID: {userId}
          </p>
        </div>
      );
    }

    return (
      <div className="text-sm">
        <p className="text-muted-foreground">Đang tải...</p>
        <p className="text-muted-foreground text-xs">ID: {userId}</p>
      </div>
    );
  };

  const renderReadStatus = (notification: Notification) => {
    if (isNotificationRead(notification)) {
      return (
        <Badge variant="secondary" size="sm" className="mt-1">
          ✓ Đã đọc
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" size="sm" className="mt-1">
          ● Chưa đọc
        </Badge>
      );
    }
  };

  const getRowClassName = (notification: Notification): string => {
    const baseClass = "";
    const unreadClass = "bg-blue-50 border-l-4 border-l-blue-400";
    
    return isNotificationRead(notification) ? baseClass : unreadClass;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý thông báo</h2>
            <p className="text-muted-foreground">Xem và quản lý thông báo hệ thống</p>
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
    );
  }

  return (
    <div className="space-y-6">

      {/* New notification toast */}
      {newNotificationsCount > 0 && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Card className="border-green-500 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-green-700">
                  🔔 {newNotificationsCount} thông báo mới
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý thông báo</h2>
          <p className="text-muted-foreground">
            Xem và quản lý thông báo hệ thống
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} chưa đọc
              </Badge>
            )}
          </p>
          {/* Auto-refresh indicator */}
          <p className="text-xs text-muted-foreground mt-1">
            {isAutoRefreshing ? (
              <span className="flex items-center">
                <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                Đang kiểm tra thông báo mới...
              </span>
            ) : (
              `Cập nhật lần cuối: ${formatDate(lastFetchTime)} • Tự động kiểm tra mỗi 5 giây`
            )}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} disabled={loading}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Đánh dấu tất cả đã đọc ({unreadCount})
            </Button>
          )}
          
          {/* Manual refresh button */}
          <Button 
            variant="outline" 
            onClick={loadNotifications} 
            disabled={loading || isAutoRefreshing}
          >
            🔄 Làm mới
          </Button>

          {/* Test button để force trigger auto-refresh */}
          {process.env.NODE_ENV === 'development' && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={checkForNewNotifications}
              disabled={isAutoRefreshing}
            >
              Test Auto-Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Stats display */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Tổng thông báo</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Chưa đọc</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
                <p className="text-sm text-muted-foreground">Đã đọc</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">❌ {error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              setError(null);
              loadNotifications();
            }}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Notifications table */}
      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Chưa có thông báo nào</p>
              <p className="text-xs text-muted-foreground mt-2">
                Thông báo sẽ xuất hiện khi có hoạt động trong hệ thống
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Thông báo</TableHead>
                  <TableHead className="w-1/4">Người nhận</TableHead>
                  <TableHead className="w-32">Thời gian</TableHead>
                  <TableHead className="text-right w-32">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id} className={getRowClassName(notification)}>
                    <TableCell className="w-1/2">
                      <div className="flex items-start space-x-3">
                        {!isNotificationRead(notification) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm break-words whitespace-pre-wrap ${!isNotificationRead(notification) ? "font-medium" : ""}`}>
                            {notification.message}
                          </p>
                          {renderReadStatus(notification)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/4">
                      {renderUserInfo(notification.userId)}
                    </TableCell>
                    <TableCell className="w-32">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(notification.sentAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right w-32">
                      {!isNotificationRead(notification) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-8 px-2"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Đánh dấu đã đọc
                        </Button>
                      ) : (
                        <span className="text-xs text-green-600">✓ Đã đọc</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {notifications.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Tổng cộng: {notifications.length} thông báo • 
          {unreadCount > 0 ? (
            <span className="text-orange-600 font-medium"> {unreadCount} chưa đọc</span>
          ) : (
            <span className="text-green-600 font-medium"> Tất cả đã đọc</span>
          )}
          • {notifications.length - unreadCount} đã đọc
        </div>
      )}
    </div>
  );
}