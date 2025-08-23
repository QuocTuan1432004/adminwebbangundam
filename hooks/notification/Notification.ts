const API_BASE_URL = 'http://localhost:8080'

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface NotificationsResponse {
  id: string;
  user_id: string;
  message: string;
  readOrNot: boolean; // Sửa lại theo backend response
  sent_at: string; // LocalDateTime from backend as string
}

export interface NotificationsRequest {
  email: string;
  message: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  sentAt: Date;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
};

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token');
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

const mapNotificationResponseToNotification = (data: NotificationsResponse): Notification => {
  return {
    id: data.id,
    userId: data.user_id,
    message: data.message,
    isRead: data.readOrNot, // Sửa lại mapping đúng field từ backend
    sentAt: new Date(data.sent_at),
  };
};

// Lấy tất cả thông báo
export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/notification/getAll`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return result.result?.map(mapNotificationResponseToNotification) || [];
};

// Đánh dấu đã đọc
export const markAsRead = async (notificationId: string): Promise<string> => {
  console.log(`📤 Calling markAsRead API for notification: ${notificationId}`);
  const response = await authenticatedFetch(`${API_BASE_URL}/notification/markAsRead/${notificationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  console.log(`📤 markAsRead API response:`, result);
  return result.result;
};

// Gửi thông báo (nếu có API create trong tương lai)
// export const sendNotification = async (data: NotificationsRequest): Promise<Notification> => {
//   const response = await authenticatedFetch(`${API_BASE_URL}/notification/send`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   const result = await handleResponse(response);
//   return mapNotificationResponseToNotification(result.result);
// };

// Lấy số lượng thông báo chưa đọc
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const notifications = await getAllNotifications();
    const unreadCount = notifications.filter(notification => !notification.isRead).length;
    console.log(`📊 Unread count calculated: ${unreadCount} out of ${notifications.length}`);
    return unreadCount;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
};

// Đánh dấu tất cả đã đọc (helper function)
export const markAllAsRead = async (): Promise<void> => {
  try {
    const notifications = await getAllNotifications();
    const unreadNotifications = notifications.filter(notification => !notification.isRead);
    
    console.log(`📤 Marking ${unreadNotifications.length} notifications as read...`);
    
    const markAsReadPromises = unreadNotifications.map(notification => 
      markAsRead(notification.id)
    );
    
    await Promise.all(markAsReadPromises);
    console.log(`✅ All ${unreadNotifications.length} notifications marked as read`);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Lấy thông báo mới nhất
export const getLatestNotifications = async (limit: number = 5): Promise<Notification[]> => {
  try {
    const notifications = await getAllNotifications();
    return notifications
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting latest notifications:', error);
    return [];
  }
};