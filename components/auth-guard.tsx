"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminAuthService } from "@/hooks/user/userAuth";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = AdminAuthService.getToken();

      if (!token) {
        router.push("/"); // Redirect to root instead of /login
        return;
      }

      // Simple token check - just verify it exists and is not empty
      if (token && token.length > 0) {
        setIsAuthenticated(true);
      } else {
        // Clear any invalid token data
        AdminAuthService.clearAuthData();
        router.push("/"); // Redirect to root instead of /login
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600">Kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}