import { ReactNode } from "react";

const API_BASE_URL = 'http://localhost:8080';

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}
export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
export interface OrderDetailInfo {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface OrderResponse {
    orderId: string;
    userId: string;
    customerName: string;
    email: string; // THÊM field này
    phoneNumber: string;
    address: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    orderDetails: OrderDetailInfo[];
    paymentUrl?: string;
  }

  export interface Order {
    id: string;
    customer: string;
    email: string; // THÊM field này
    phoneNumber: string;
    address: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: number;
    paymentMethod: string;
    paymentStatus: string;
    orderDetails?: OrderDetailInfo[];
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

// SỬA LẠI MAPPING FUNCTION
const mapOrderResponseToOrder = (data: OrderResponse): Order => {
    return {
      id: data.orderId,
      customer: data.customerName || 'Không có thông tin',
      phoneNumber: data.phoneNumber || '',
      address: data.address || '',
      status: data.status,
      email: data.email || '', // SỬA: lấy từ data.email thay vì data.userId
      totalAmount: data.totalAmount || 0,
      createdAt: data.orderDate,
      items: data.orderDetails?.length || 0,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      orderDetails: data.orderDetails || [],
    };
  };

// Lấy danh sách đơn hàng cho admin
// Cập nhật getOrdersForAdmin trong Order.ts
// Cập nhật API call trong Order.ts
export const getOrdersForAdmin = async (page: number = 0, size: number = 10, status?: string, search?: string) => {
    let url = `${API_BASE_URL}/order/admin?page=${page}&size=${size}`;
    
    if (status && status !== 'all') {
      url += `&status=${status}`;
    }
    
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    
    const response = await authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await handleResponse(response);
    
    if (result.result && result.result.content) {
      return {
        orders: result.result.content.map(mapOrderResponseToOrder),
        totalElements: result.result.totalElements,
        totalPages: result.result.totalPages,
        currentPage: result.result.number,
        pageSize: result.result.size,
      };
    }
    
    return {
      orders: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: size,
    };
  };

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log("Updating order status:", { orderId, newStatus });
      
      const response = await authenticatedFetch(`${API_BASE_URL}/order/update-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // SỬA: Convert thành uppercase
        body: JSON.stringify({ newStatus: newStatus.toUpperCase() }),
      });
      
      const result = await handleResponse(response);
      return mapOrderResponseToOrder(result.result);
    } catch (error) {
      console.error("Update order status error:", error);
      throw error;
    }
  };

// Cancel order - SỬA LẠI FUNCTION NAME
export const cancelOrder = async (orderId: string) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/order/cancel/${orderId}`, {
    method: 'PUT',
  });
  const result = await handleResponse(response);
  return result;
};
// Admin cancel order
export const adminCancelOrder = async (orderId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/order/admin/cancel/${orderId}`, {
      method: 'PUT',
    });
    const result = await handleResponse(response);
    return result;
  };
// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId: string) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/order/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return mapOrderResponseToOrder(result.result);
};

// Thêm interface cho PaymentLogResponse
export interface PaymentLogResponse {
  id: string;
  orderId: string;
  method: string; // COD, VNPay
  status: string; // CONFIRMED, FAILED, PENDING
  amount: number;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
}

// Interface cho order notification data
export interface OrderNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  paidAt?: string;
  method: string;
  transactionId?: string;
}

// Thêm vào orderApi object
export const orderApi = {
  // ...existing methods...

  // Lấy payment logs đã thanh toán thành công cho notifications
  getPaidOrdersForNotifications: async (token: string): Promise<ApiResponse<OrderNotificationData[]>> => {
    try {
      // Gọi API PaymentLogController để lấy các payment đã CONFIRMED
      const response = await fetch(`${API_BASE_URL}/payment-logs/filter?method=all&status=CONFIRMED&page=0&size=50`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const paymentLogsPage = await response.json();
      
      // Chuyển đổi PaymentLogResponse thành OrderNotificationData
      const orderNotifications: OrderNotificationData[] = paymentLogsPage.content.map((paymentLog: PaymentLogResponse) => ({
        orderId: paymentLog.orderId,
        customerName: paymentLog.customerName || "Khách hàng",
        customerEmail: paymentLog.customerEmail || "",
        totalAmount: paymentLog.amount,
        paymentStatus: paymentLog.status,
        createdAt: paymentLog.createdAt,
        paidAt: paymentLog.paidAt,
        method: paymentLog.method,
        transactionId: paymentLog.transactionId,
      }));

      // Trả về format ApiResponse để consistent với các API khác
      return {
        code: 200,
        message: "Success",
        result: orderNotifications
      };
      
    } catch (error) {
      console.error('Get paid orders for notifications API error:', error);
      throw error;
    }
  },

  // Lấy tất cả payment logs (có thể dùng cho các mục đích khác)
  getAllPaymentLogs: async (token: string, method: string = "all", page: number = 0, size: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-logs?method=${method}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        code: 200,
        message: "Success",
        result: result
      };
      
    } catch (error) {
      console.error('Get all payment logs API error:', error);
      throw error;
    }
  },

  // Lấy payment logs theo method và status
  getPaymentLogsByMethodAndStatus: async (
    token: string, 
    method: string = "all", 
    status: string, 
    page: number = 0, 
    size: number = 10
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-logs/filter?method=${method}&status=${status}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        code: 200,
        message: "Success",
        result: result
      };
      
    } catch (error) {
      console.error('Get payment logs by method and status API error:', error);
      throw error;
    }
  },
};