"use client";
import { useState, useEffect } from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userApi } from "@/hooks/user/userApi";
import { AdminAuthService } from "@/hooks/user/userAuth";
import { getProductCount } from "@/hooks/product/product";

// Mock data for other stats
const dashboardStats = {
  totalRevenue: "2,450,000,000",
  totalOrders: 1234,
};

const orders = [
  {
    id: "ORD001",
    customer: "Nguyễn Văn A",
    date: "2024-01-15",
    total: 1850000,
    status: "completed",
    items: 2,
  },
  {
    id: "ORD002",
    customer: "Trần Thị B",
    date: "2024-01-14",
    total: 650000,
    status: "processing",
    items: 1,
  },
  {
    id: "ORD003",
    customer: "Lê Văn C",
    date: "2024-01-13",
    total: 3500000,
    status: "shipped",
    items: 1,
  },
];

const products = [
  {
    id: 1,
    name: "RG RX-78-2 Gundam",
    category: "Real Grade",
    price: 650000,
    stock: 25,
    status: "active",
    thumbnail: "/placeholder.svg?height=60&width=60&text=RG",
  },
  {
    id: 2,
    name: "MG Strike Freedom",
    category: "Master Grade",
    price: 1200000,
    stock: 15,
    status: "active",
    thumbnail: "/placeholder.svg?height=60&width=60&text=MG",
  },
  {
    id: 3,
    name: "PG Unicorn Gundam",
    category: "Perfect Grade",
    price: 3500000,
    stock: 5,
    status: "active",
    thumbnail: "/placeholder.svg?height=60&width=60&text=PG",
  },
];

export function DashboardPage() {
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customerError, setCustomerError] = useState("");

  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  // Load total customer count from API
  useEffect(() => {
    const loadCustomerCount = async () => {
      try {
        setLoadingCustomers(true);
        setCustomerError("");
        
        const token = AdminAuthService.getToken();
        if (!token) {
          setCustomerError("No authentication token");
          return;
        }

        const response = await userApi.getUserCount(token);
        
        if (response.result !== undefined) {
          setTotalCustomers(response.result);
        } else {
          setCustomerError("Không thể tải số lượng khách hàng");
        }
      } catch (err) {
        console.error("Error loading customer count:", err);
        setCustomerError("Lỗi khi tải số lượng khách hàng");
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomerCount();
  }, []);

  // Load total product count from API
  useEffect(() => {
    const loadProductCount = async () => {
      try {
        setLoadingProducts(true);
        setProductError("");
        
        const count = await getProductCount();
        setTotalProducts(count);
      } catch (err) {
        console.error("Error loading product count:", err);
        setProductError("Lỗi khi tải số lượng sản phẩm");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProductCount();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Hoạt động", variant: "default" as const },
      inactive: { label: "Không hoạt động", variant: "secondary" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      processing: { label: "Đang xử lý", variant: "secondary" as const },
      shipped: { label: "Đã giao", variant: "outline" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "secondary" as const,
    };
    return (
      <Badge
        variant={statusInfo.variant}
        className="bg-slate-100 text-slate-700 border-slate-200"
      >
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
          <p className="text-slate-600">Tổng quan về cửa hàng GUNDŌKAI</p>
        </div>
        <div className="flex items-center gap-2"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Tổng doanh thu
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(Number.parseInt(dashboardStats.totalRevenue))}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +20.1% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Tổng đơn hàng
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardStats.totalOrders}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% so với tháng trước
            </div>
          </CardContent>
        </Card>

        {/* Updated Product Count Card */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Tổng sản phẩm
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {loadingProducts ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  Loading...
                </div>
              ) : productError ? (
                <span className="text-red-500 text-sm">Error</span>
              ) : (
                totalProducts.toLocaleString('vi-VN')
              )}
            </div>
            {/* ❌ BỎ: "Dữ liệu thực từ API" text */}
            {!loadingProducts && !productError && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5 sản phẩm mới
              </div>
            )}
            {productError && (
              <div className="flex items-center text-xs text-red-500 mt-1">
                {productError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Count Card */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Tổng khách hàng
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {loadingCustomers ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                  Loading...
                </div>
              ) : customerError ? (
                <span className="text-red-500 text-sm">Error</span>
              ) : (
                totalCustomers.toLocaleString('vi-VN')
              )}
            </div>
            {/* ❌ BỎ: "Dữ liệu thực từ API" text */}
            {!loadingCustomers && !customerError && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Dữ liệu thực từ API
              </div>
            )}
            {customerError && (
              <div className="flex items-center text-xs text-red-500 mt-1">
                {customerError}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rest of the dashboard remains the same */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div>
                    <p className="font-medium text-slate-900">{order.id}</p>
                    <p className="text-sm text-slate-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(order.total)}
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.name}
                      className="w-10 h-10 rounded border border-slate-200"
                    />
                    <div>
                      <p className="font-medium text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        Còn {product.stock} sản phẩm
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-slate-900">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}