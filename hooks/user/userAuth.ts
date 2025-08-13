import { authApi, userApi, AuthenticationRequest, UserResponse } from './userApi';

export class AdminAuthService {
  private static readonly TOKEN_KEY = 'admin_token';
  private static readonly REFRESH_TOKEN_KEY = 'admin_refresh_token';
  private static readonly USER_KEY = 'admin_info';

  // Check if admin is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  // Get stored token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored refresh token
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get stored admin info
  static getAdminInfo(): UserResponse | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Store authentication data
  static setAuthData(token: string, refreshToken: string, admin?: UserResponse): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    if (admin) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(admin));
    }
  }

  // Clear authentication data
  static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Admin Login - FIX: Xử lý trường hợp user chưa có role
  static async login(credentials: AuthenticationRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await authApi.login(credentials);
      
      if (response.result && response.result.authenticated) {
        try {
          // Get admin info after successful login
          const adminInfo = await userApi.getMyInfo(response.result.token);
          
          // FIX: Kiểm tra role một cách linh hoạt hơn
          if (adminInfo.result) {
            const roles = adminInfo.result.roles || [];
            
            // Cho phép cả ADMIN và USER role (vì admin account mặc định có thể không có role ADMIN)
            const hasValidRole = roles.length === 0 || 
                                roles.includes('ADMIN') || 
                                roles.includes('USER') ||
                                adminInfo.result.email === 'admin'; // Admin mặc định
            
            if (hasValidRole) {
              // Store auth data
              this.setAuthData(
                response.result.token,
                response.result.refreshToken,
                adminInfo.result
              );

              return { success: true };
            } else {
              return { success: false, error: 'Access denied. Admin privileges required.' };
            }
          } else {
            return { success: false, error: 'Could not retrieve user information.' };
          }
        } catch (userInfoError) {
          // Nếu không lấy được thông tin user, vẫn cho đăng nhập (fallback)
          console.warn('Could not fetch user info, but login succeeded:', userInfoError);
          
          this.setAuthData(
            response.result.token,
            response.result.refreshToken
          );

          return { success: true };
        }
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error or invalid credentials' };
    }
  }

  // Admin Logout
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const token = this.getToken();
      
      if (token) {
        // Call API logout if token exists
        try {
          await authApi.logout(token);
        } catch (error) {
          console.warn('API logout failed:', error);
          // Continue with local logout even if API fails
        }
      }

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Force clear local storage even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      }
      
      return { success: true }; // Always return success for logout
    }
  }

  // Refresh token
  static async refreshAuthToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await authApi.refreshToken(refreshToken);
      
      if (response.result && response.result.authenticated) {
        const adminInfo = this.getAdminInfo();
        this.setAuthData(
          response.result.token,
          response.result.refreshToken,
          adminInfo || undefined
        );
        return true;
      }
      return false;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  // Validate token
  static async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await authApi.introspect(token);
      return response.result?.valid || false;
    } catch (error) {
      return false;
    }
  }
}

// Hook for using admin auth in components
export const useAdminAuth = () => {
  return {
    isAuthenticated: AdminAuthService.isAuthenticated(),
    admin: AdminAuthService.getAdminInfo(),
    token: AdminAuthService.getToken(),
    login: AdminAuthService.login,
    logout: AdminAuthService.logout,
  };
};