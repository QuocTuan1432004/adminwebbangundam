"use client";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data
const dashboardStats = {
  totalRevenue: "2,450,000,000",
  totalOrders: 1234,
  totalProducts: 567,
  totalCustomers: 890,
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
              {dashboardStats.totalProducts}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 sản phẩm mới
            </div>
          </CardContent>
        </Card>

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
              {dashboardStats.totalCustomers}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

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
