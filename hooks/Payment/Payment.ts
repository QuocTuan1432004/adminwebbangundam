const API_BASE_URL = 'http://localhost:8080'; // Thay bằng URL của backend

// Hàm xử lý response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// Hàm fetch với xác thực
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token'); // Lấy token từ localStorage
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// Hàm lấy danh sách thanh toán theo phương thức
export const getPaymentLogs = async (method: string, page: number = 0, size: number = 10) => {
  const url = `${API_BASE_URL}/payment-logs?method=${method}&page=${page}&size=${size}`;

  try {
    const response = await authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleResponse(response);
    return result; // Trả về danh sách thanh toán
  } catch (error) {
    console.error("Error fetching payment logs:", error);
    throw error;
  }
};

// Hàm lấy danh sách thanh toán theo phương thức và trạng thái
export const getPaymentLogsByStatus = async (method: string, status: string, page: number = 0, size: number = 10) => {
  const url = `${API_BASE_URL}/payment-logs/filter?method=${method}&status=${status}&page=${page}&size=${size}`;

  try {
    const response = await authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleResponse(response);
    return result; // Trả về danh sách thanh toán theo trạng thái
  } catch (error) {
    console.error("Error fetching payment logs by status:", error);
    throw error;
  }
};

// Hàm đánh dấu đơn hàng đã thanh toán
export const markOrderAsPaid = async (orderId: string) => {
  const url = `${API_BASE_URL}/payment/mark-paid/${orderId}`;

  try {
    const response = await authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleResponse(response);
    return result; // Trả về kết quả đánh dấu thanh toán
  } catch (error) {
    console.error("Error marking order as paid:", error);
    throw error;
  }
};

// Hàm đánh dấu đơn hàng thất bại
export const markOrderAsFailed = async (orderId: string) => {
  const url = `${API_BASE_URL}/payment/mark-failed/${orderId}`;

  try {
    const response = await authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleResponse(response);
    return result; // Trả về kết quả đánh dấu thất bại
  } catch (error) {
    console.error("Error marking order as failed:", error);
    throw error;
  }
};