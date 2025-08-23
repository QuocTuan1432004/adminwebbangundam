const API_BASE_URL = 'http://localhost:8080'; // Hardcode trực tiếp

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  refreshToken: string;
  authenticated: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface UserResponse {
  id: string;
  username?: string;
  email: string;
  fullName?: string;
  phoneNumber?: number;  // Thêm phoneNumber
  gender?: string;       // Thêm gender  
  createdAt?: string;    // Thêm createdAt
  roles: string[];
}

export interface EmailResponse {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  gender?: string;
  createdAt?: string;
  roles: string[];
}

// Auth APIs - Chỉ cho admin
export const authApi = {
  // Login admin
  login: async (data: AuthenticationRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  // Logout admin
  logout: async (token: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthenticationResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Refresh token API error:', error);
      throw error;
    }
  },

  // Introspect token
  introspect: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/introspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Introspect API error:', error);
      throw error;
    }
  },
};

// User APIs - Chỉ cho admin quản lý users
export const userApi = {
  // Get admin info
  getMyInfo: async (token: string): Promise<ApiResponse<UserResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/my-info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get user info API error:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (token: string, userId: string): Promise<ApiResponse<UserResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get user by ID API error:', error);
      throw error;
    }
  },

  // Get all users (for admin to view)
  getAllUsers: async (token: string): Promise<ApiResponse<UserResponse[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get all users API error:', error);
      throw error;
    }
  },

  // Search users by email/keyword
  searchUsers: async (token: string, keyword: string): Promise<ApiResponse<EmailResponse[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/search?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Search users API error:', error);
      throw error;
    }
  },

  // Delete user (admin function)
  deleteUser: async (token: string, userId: string): Promise<ApiResponse<string>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Delete user API error:', error);
      throw error;
    }
  },

  // Get total user count
  getUserCount: async (token: string): Promise<ApiResponse<number>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get user count API error:', error);
      throw error;
    }
  },
};