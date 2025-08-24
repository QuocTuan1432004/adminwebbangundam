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
import { Button } from "@/components/ui/button";
import { userApi } from "@/hooks/user/userApi";
import { AdminAuthService } from "@/hooks/user/userAuth";
import { getProductCount } from "@/hooks/product/product";
// ✅ THÊM: Import order API
import { orderApi, getOrdersForAdmin, Order } from "@/hooks/Order/Order";

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

  // States cho doanh thu và đơn hàng
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [revenueError, setRevenueError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  // ✅ THÊM: States cho recent orders
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loadingRecentOrders, setLoadingRecentOrders] = useState(true);
  const [recentOrdersError, setRecentOrdersError] = useState("");

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

  // Load doanh thu và tổng đơn hàng từ Payment Logs
  useEffect(() => {
    const loadRevenueAndOrders = async () => {
      try {
        setLoadingRevenue(true);
        setLoadingOrders(true);
        setRevenueError("");
        setOrdersError("");
        
        const token = AdminAuthService.getToken();
        if (!token) {
          setRevenueError("No authentication token");
          setOrdersError("No authentication token");
          return;
        }

        // Lấy tất cả payment logs đã CONFIRMED để tính doanh thu
        const paidOrdersResponse = await orderApi.getPaidOrdersForNotifications(token);
        
        if (paidOrdersResponse.result && Array.isArray(paidOrdersResponse.result)) {
          const paidOrders = paidOrdersResponse.result;
          
          // Tính tổng doanh thu từ các đơn đã thanh toán
          const revenue = paidOrders.reduce((total, order) => total + order.totalAmount, 0);
          setTotalRevenue(revenue);
          
          // Tổng số đơn hàng đã thanh toán
          setTotalOrders(paidOrders.length);
          
          console.log(`📊 Dashboard Stats: ${paidOrders.length} orders, ${revenue.toLocaleString('vi-VN')} VND revenue`);
        } else {
          setTotalRevenue(0);
          setTotalOrders(0);
        }
      } catch (err) {
        console.error("Error loading revenue and orders:", err);
        setRevenueError("Lỗi khi tải doanh thu");
        setOrdersError("Lỗi khi tải đơn hàng");
      } finally {
        setLoadingRevenue(false);
        setLoadingOrders(false);
      }
    };

    loadRevenueAndOrders();
  }, []);

  // ✅ THÊM: Load recent orders từ API
  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        setLoadingRecentOrders(true);
        setRecentOrdersError("");
        
        const token = AdminAuthService.getToken();
        if (!token) {
          setRecentOrdersError("No authentication token");
          return;
        }

        console.log("🔄 Loading recent orders...");
        // Lấy 5 đơn hàng mới nhất
        const response = await getOrdersForAdmin(0, 5);
        
        if (response.orders && response.orders.length > 0) {
          setRecentOrders(response.orders);
          console.log("✅ Recent orders loaded:", response.orders.length);
        } else {
          setRecentOrders([]);
          console.log("⚠️ No recent orders found");
        }
      } catch (err: any) {
        console.error("❌ Error loading recent orders:", err);
        setRecentOrdersError("Lỗi khi tải đơn hàng gần đây");
        setRecentOrders([]);
      } finally {
        setLoadingRecentOrders(false);
      }
    };

    loadRecentOrders();
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
      
      // Order statuses from API
      PENDING: { label: "Chờ xử lý", variant: "secondary" as const },
      CONFIRMED: { label: "Đã xác nhận", variant: "default" as const },
      PROCESSING: { label: "Đang xử lý", variant: "secondary" as const },
      SHIPPED: { label: "Đã giao", variant: "outline" as const },
      DELIVERED: { label: "Hoàn thành", variant: "default" as const },
      CANCELLED: { label: "Đã hủy", variant: "destructive" as const },
      
      // Legacy statuses
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
        {/* Revenue Card với API thật */}
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
              {loadingRevenue ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  Loading...
                </div>
              ) : revenueError ? (
                <span className="text-red-500 text-sm">Error</span>
              ) : (
                formatCurrency(totalRevenue)
              )}
            </div>
            {!loadingRevenue && !revenueError && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Từ đơn hàng đã thanh toán
              </div>
            )}
            {revenueError && (
              <div className="flex items-center text-xs text-red-500 mt-1">
                {revenueError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Card với API thật */}
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
              {loadingOrders ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Loading...
                </div>
              ) : ordersError ? (
                <span className="text-red-500 text-sm">Error</span>
              ) : (
                totalOrders.toLocaleString('vi-VN')
              )}
            </div>
            {!loadingOrders && !ordersError && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Đơn hàng đã thanh toán
              </div>
            )}
            {ordersError && (
              <div className="flex items-center text-xs text-red-500 mt-1">
                {ordersError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Count Card */}
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
            {!loadingCustomers && !customerError && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3 khách hàng mới
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

      {/* ✅ SỬA: Bottom section với API thật */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* ✅ Recent Orders Card với API thật */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loadingRecentOrders ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-muted-foreground">Đang tải đơn hàng...</span>
              </div>
            ) : recentOrdersError ? (
              <div className="text-center py-6">
                <p className="text-red-500 text-sm">{recentOrdersError}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Thử lại
                </Button>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">Chưa có đơn hàng nào</p>
                <p className="text-xs text-muted-foreground mt-1">Đơn hàng sẽ xuất hiện khi có khách hàng đặt mua</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-600">{order.customer}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      {getStatusBadge(order.status)}
                      <p className="text-xs text-slate-500 mt-1">
                        {order.items} sản phẩm
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Show more link if we have more orders */}
                {recentOrders.length > 3 && (
                  <div className="text-center pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Và {recentOrders.length - 3} đơn hàng khác...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Card - Mock data */}
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