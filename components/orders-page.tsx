"use client";

import * as React from "react";
import {
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getOrdersForAdmin,
  updateOrderStatus,
  adminCancelOrder,
  Order,
} from "../hooks/Order/Order";
// ✅ THÊM: Import product API
import { getProductsByIds, Product } from "@/hooks/product/product";
import { webSocketService } from "@/lib/websocket";

export function OrdersPage() {
  // States cho orders
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(false);

  // ✅ THÊM: States cho products cache
  const [productsMap, setProductsMap] = React.useState<{ [key: string]: Product }>({});
  const [loadingProducts, setLoadingProducts] = React.useState(false);

  // States cho phân trang
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);

  // State dialogs
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Order | null>(null);
  const [itemToDelete, setItemToDelete] = React.useState<Order | null>(null);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // WebSocket states
  const [wsConnected, setWsConnected] = React.useState(false);

  // ✅ THÊM: Function để lấy tên sản phẩm
  const getProductName = (productId: string): string => {
    const product = productsMap[productId];
    return product ? product.productName : `Sản phẩm ${productId}`;
  };

  // ✅ THÊM: Function để lấy giá sản phẩm
  const getProductPrice = (productId: string): number => {
    const product = productsMap[productId];
    return product ? product.price : 0;
  };

  // Fetch orders data với phân trang
  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrdersForAdmin(currentPage, pageSize);
        console.log("📦 Orders data:", data);

        setOrders(data.orders);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        alert("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, pageSize]);

  // ✅ THÊM: Load product details khi orders thay đổi
  React.useEffect(() => {
    const loadProductDetails = async () => {
      if (orders.length === 0) return;

      setLoadingProducts(true);
      try {
        // Collect tất cả product IDs từ orders
        const allProductIds = new Set<string>();
        orders.forEach(order => {
          order.orderDetails?.forEach(detail => {
            if (detail.productId && !productsMap[detail.productId]) {
              allProductIds.add(detail.productId);
            }
          });
        });

        const productIdsArray = Array.from(allProductIds);
        
        if (productIdsArray.length > 0) {
          console.log("🔄 Loading product details for:", productIdsArray);
          const newProductsMap = await getProductsByIds(productIdsArray);
          
          // Merge với existing products map
          setProductsMap(prev => ({
            ...prev,
            ...newProductsMap
          }));
          
          console.log("✅ Product details loaded:", Object.keys(newProductsMap).length);
        }
      } catch (error) {
        console.error("❌ Error loading product details:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProductDetails();
  }, [orders, productsMap]);

  // Kết nối WebSocket khi component mount
  React.useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect();
        setWsConnected(true);
        console.log("WebSocket connected in orders page");
      } catch (error) {
        console.error("Failed to connect WebSocket in orders page:", error);
        setWsConnected(false);
      }
    };

    connectWebSocket();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reset page khi search/filter thay đổi
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, statusFilter]);

  const formatCurrency = (amount: number): string => {
    if (!amount || isNaN(amount) || amount === 0) {
      return "0 ₫";
    }
    return `${amount.toLocaleString("vi-VN")} ₫`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      COMPLETED: { label: "Hoàn thành", variant: "default" as const },
      PROCESSING: { label: "Đang xử lý", variant: "secondary" as const },
      PENDING: { label: "Chờ xử lý", variant: "outline" as const },
      SHIPPED: { label: "Đã giao", variant: "default" as const },
      CANCELLED: { label: "Đã hủy", variant: "destructive" as const },
      CONFIRMED: { label: "Đã xác nhận", variant: "default" as const },
      DELIVERED: { label: "Đã giao", variant: "default" as const },
    };

    const config = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "outline" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleUpdateStatus = async () => {
    if (!selectedItem || !newStatus) {
      alert("Vui lòng chọn trạng thái mới!");
      return;
    }

    try {
      console.log("Updating order:", selectedItem.id, "to status:", newStatus);

      await updateOrderStatus(selectedItem.id, newStatus);
      alert("Cập nhật trạng thái thành công!");

      // Cập nhật trạng thái đơn hàng trong danh sách
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedItem.id ? { ...order, status: newStatus } : order
        )
      );

      setIsEditOrderOpen(false);
      setSelectedItem(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating order status:", error);

      if (error instanceof Error) {
        alert(`Cập nhật trạng thái thất bại: ${error.message}`);
      } else {
        alert("Cập nhật trạng thái thất bại!");
      }
    }
  };

  const handleCancelOrder = async () => {
    if (!itemToDelete) return;

    try {
      await adminCancelOrder(itemToDelete.id);
      alert("Hủy đơn hàng thành công!");

      // Cập nhật trạng thái đơn hàng trong state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === itemToDelete.id
            ? { ...order, status: "CANCELLED" }
            : order
        )
      );

      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Hủy đơn hàng thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý đơn hàng
          </h2>
          <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng</p>
        </div>
        {/* ✅ BỎ: Removed buttons */}
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
            <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
            <SelectItem value="SHIPPED">Đã giao</SelectItem>
            <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
        {loadingProducts && (
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Đang tải thông tin sản phẩm...
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Số sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Đang tải đơn hàng...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <TableRow key={`${order.id}-${index}`}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(order);
                              setIsViewDetailsOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(order);
                              setIsEditOrderOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Cập nhật trạng thái
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setItemToDelete(order);
                              setIsDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hủy đơn hàng
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6 py-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            ← Trước
          </Button>

          <span className="text-sm text-gray-600">
            Trang {currentPage + 1} / {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage >= totalPages - 1}
          >
            Sau →
          </Button>
        </div>
      )}

      {/* ✅ Dialog xem chi tiết đơn hàng - ĐIỀU CHỈNH KẾT THƯỚC PHÙ HỢP VỚI BẢNG */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="min-w-[90vw] max-w-[95vw] w-fit max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Chi tiết đơn hàng {selectedItem?.id}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-8 py-6">
              {/* Thông tin đơn hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Thông tin đơn hàng</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mã đơn hàng
                    </Label>
                    <p className="font-medium text-lg">{selectedItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Ngày đặt hàng
                    </Label>
                    <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedItem.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phương thức thanh toán
                    </Label>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-sm">
                        {selectedItem.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Số sản phẩm
                    </Label>
                    <p className="font-medium">{selectedItem.items} sản phẩm</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tổng tiền
                    </Label>
                    <p className="font-bold text-lg text-green-600">{formatCurrency(selectedItem.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tên khách hàng
                    </Label>
                    <p className="font-medium text-lg">{selectedItem.customer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="font-medium">{selectedItem.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Số điện thoại
                    </Label>
                    <p className="font-medium">{selectedItem.phoneNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Địa chỉ giao hàng
                    </Label>
                    <p className="font-medium">{selectedItem.address}</p>
                  </div>
                </div>
              </div>

              {/* ✅ SỬA: Sản phẩm trong đơn hàng với width tự động phù hợp với nội dung */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold border-b pb-2 flex-1">Sản phẩm đã đặt</h3>
                  {loadingProducts && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Đang tải thông tin sản phẩm...
                    </div>
                  )}
                </div>
                
                {/* ✅ Bảng với width tự động fit content */}
                <div className="w-full overflow-x-auto border rounded-lg shadow-sm">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold whitespace-nowrap min-w-[200px]">Mã sản phẩm</TableHead>
                        <TableHead className="font-semibold whitespace-nowrap min-w-[300px]">Tên sản phẩm</TableHead>
                        <TableHead className="font-semibold text-center whitespace-nowrap min-w-[100px]">Số lượng</TableHead>
                        <TableHead className="font-semibold text-right whitespace-nowrap min-w-[150px]">Đơn giá</TableHead>
                        <TableHead className="font-semibold text-right whitespace-nowrap min-w-[150px]">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItem?.orderDetails &&
                      selectedItem.orderDetails.length > 0 ? (
                        selectedItem.orderDetails.map((detail, index) => (
                          <TableRow key={detail.id || index} className="hover:bg-gray-50">
                            <TableCell className="font-medium font-mono text-sm whitespace-nowrap">
                              {detail.productId}
                            </TableCell>
                            <TableCell className="min-w-[300px]">
                              <div>
                                <p className="font-medium text-base">
                                  {getProductName(detail.productId)}
                                </p>
                                {!productsMap[detail.productId] && !loadingProducts && (
                                  <p className="text-xs text-orange-600 mt-1">
                                    ⚠️ Chưa tải được thông tin sản phẩm
                                  </p>
                                )}
                                {loadingProducts && !productsMap[detail.productId] && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    📥 Đang tải thông tin...
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium text-base whitespace-nowrap">{detail.quantity}</TableCell>
                            <TableCell className="text-right font-medium whitespace-nowrap">{formatCurrency(detail.unitPrice)}</TableCell>
                            <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">{formatCurrency(detail.subTotal)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Không có sản phẩm nào trong đơn hàng
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Summary section */}
                <div className="flex justify-end border-t pt-6 mt-6">
                  <div className="text-right space-y-2">
                    <div className="flex justify-between items-center min-w-[350px]">
                      <span className="text-base text-muted-foreground">Số lượng sản phẩm:</span>
                      <span className="font-medium">{selectedItem.items} sản phẩm</span>
                    </div>
                    <div className="flex justify-between items-center min-w-[350px] pt-2 border-t">
                      <span className="text-lg font-semibold">Tổng cộng:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(selectedItem?.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-6 border-t">
            <Button onClick={() => setIsViewDetailsOpen(false)} className="px-8">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Dialog cập nhật trạng thái - Tách riêng */}
      <Dialog open={isEditOrderOpen && selectedItem !== null} onOpenChange={(open) => {
        if (!open) {
          setIsEditOrderOpen(false);
          setSelectedItem(null);
          setNewStatus("");
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Cập nhật trạng thái cho đơn hàng {selectedItem?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Mã đơn hàng:</Label>
              <p className="font-medium">{selectedItem?.id}</p>
            </div>
            <div className="grid gap-2">
              <Label>Khách hàng:</Label>
              <p>{selectedItem?.customer}</p>
            </div>
            <div className="grid gap-2">
              <Label>Trạng thái hiện tại:</Label>
              {selectedItem && getStatusBadge(selectedItem.status)}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-order-status">Trạng thái mới</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái mới" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                  <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                  <SelectItem value="SHIPPED">Đã giao</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditOrderOpen(false);
              setSelectedItem(null);
              setNewStatus("");
            }}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleUpdateStatus}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận hủy đơn hàng */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng "{itemToDelete?.id}"? Hành động
              này sẽ chuyển đơn hàng sang trạng thái "Đã hủy".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Không hủy
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Hủy đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}