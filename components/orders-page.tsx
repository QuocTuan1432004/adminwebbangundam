"use client";

import * as React from "react";
import {
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Download,
  Plus,
  X,
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
import { Textarea } from "@/components/ui/textarea";
import {
  getOrdersForAdmin,
  updateOrderStatus,
  adminCancelOrder,
  Order,
} from "../hooks/Order/Order";

// Mock data cho sản phẩm
const products = [
  { id: "P001", name: "RG RX-78-2 Gundam", price: 650000, stock: 15 },
  { id: "P002", name: "MG Strike Freedom", price: 1200000, stock: 8 },
  { id: "P003", name: "PG Unicorn Gundam", price: 3500000, stock: 3 },
  { id: "P004", name: "HG Barbatos", price: 450000, stock: 25 },
  { id: "P005", name: "RG Nu Gundam", price: 850000, stock: 12 },
];

interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export function OrdersPage() {
  // Xóa mockData, sử dụng state rỗng
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);

  // State khác
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Order | null>(null);
  const [itemToDelete, setItemToDelete] = React.useState<Order | null>(null);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // State cho form thêm đơn hàng
  const [newOrder, setNewOrder] = React.useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "",
    notes: "",
  });
  const [orderProducts, setOrderProducts] = React.useState<OrderProduct[]>([]);

  // Fetch data với phân trang
  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrdersForAdmin(currentPage, pageSize);
        console.log("Paginated data:", data);

        setOrders(data.orders);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, pageSize]);
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

  // Thêm function này vào component
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
    };

    const config = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "outline" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const addProductToOrder = () => {
    setOrderProducts([
      ...orderProducts,
      { productId: "", name: "", price: 0, quantity: 1 },
    ]);
  };

  const removeProductFromOrder = (index: number) => {
    setOrderProducts(orderProducts.filter((_, i) => i !== index));
  };

  const updateOrderProduct = (index: number, field: string, value: any) => {
    const updated = [...orderProducts];
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) {
        updated[index] = {
          ...updated[index],
          productId: value,
          name: product.name,
          price: product.price,
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setOrderProducts(updated);
  };

  const calculateTotal = () => {
    return orderProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const resetAddOrderForm = () => {
    setNewOrder({
      customer: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      paymentMethod: "",
      notes: "",
    });
    setOrderProducts([]);
  };

  // const handleAddOrder = () => {
  //   if (
  //     !newOrder.customer ||
  //     !newOrder.customerEmail ||
  //     !newOrder.customerPhone ||
  //     !newOrder.shippingAddress ||
  //     !newOrder.paymentMethod ||
  //     orderProducts.length === 0
  //   ) {
  //     alert("Vui lòng điền đầy đủ thông tin và thêm ít nhất một sản phẩm!");
  //     return;
  //   }

  //   const orderData = {
  //     ...newOrder,
  //     products: orderProducts,
  //     total: calculateTotal(),
  //     items: orderProducts.length,
  //     date: new Date().toISOString().split("T")[0],
  //     status: "processing",
  //     id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
  //   };

  //   console.log("Thêm đơn hàng mới:", orderData);
  //   setIsEditOrderOpen(false);
  //   resetAddOrderForm();
  // };

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

  function handleDeleteOrder(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý đơn hàng
          </h2>
          <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng</p>
        </div>
        {/* <div className="flex gap-2">
          <Button onClick={() => setIsEditOrderOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm đơn hàng
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div> */}
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm
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
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
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

      {/* Simple Pagination */}
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

      {/* Dialog thêm đơn hàng mới - WIDER */}
      <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm đơn hàng mới</DialogTitle>
            <DialogDescription>
              Tạo đơn hàng mới cho khách hàng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Thông tin khách hàng */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Tên khách hàng *</Label>
                  <Input
                    id="customer"
                    value={newOrder.customer}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, customer: e.target.value })
                    }
                    placeholder="Nhập tên khách hàng"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newOrder.customerEmail}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        customerEmail: e.target.value,
                      })
                    }
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerPhone">Số điện thoại *</Label>
                  <Input
                    id="customerPhone"
                    value={newOrder.customerPhone}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        customerPhone: e.target.value,
                      })
                    }
                    placeholder="0987654321"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethod">
                    Phương thức thanh toán *
                  </Label>
                  <Select
                    value={newOrder.paymentMethod}
                    onValueChange={(value) =>
                      setNewOrder({ ...newOrder, paymentMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VNPay">VNPay</SelectItem>
                      <SelectItem value="MoMo">MoMo</SelectItem>
                      <SelectItem value="ZaloPay">ZaloPay</SelectItem>
                      <SelectItem value="COD">
                        Thanh toán khi nhận hàng
                      </SelectItem>
                      <SelectItem value="Bank Transfer">
                        Chuyển khoản ngân hàng
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shippingAddress">Địa chỉ giao hàng *</Label>
                <Textarea
                  id="shippingAddress"
                  value={newOrder.shippingAddress}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      shippingAddress: e.target.value,
                    })
                  }
                  placeholder="Nhập địa chỉ giao hàng đầy đủ"
                />
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sản phẩm đặt hàng</h3>
                <Button type="button" onClick={addProductToOrder} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm sản phẩm
                </Button>
              </div>

              {orderProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[45%]">Sản phẩm</TableHead>
                          <TableHead className="w-[18%]">Đơn giá</TableHead>
                          <TableHead className="w-[12%]">SL</TableHead>
                          <TableHead className="w-[18%]">Thành tiền</TableHead>
                          <TableHead className="w-[7%]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderProducts.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell className="py-3">
                              <Select
                                value={product.productId}
                                onValueChange={(value) =>
                                  updateOrderProduct(index, "productId", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn sản phẩm" />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                      <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                          {p.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {formatCurrency(p.price)}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="font-medium text-sm">
                                {product.price > 0
                                  ? formatCurrency(product.price)
                                  : "-"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) =>
                                  updateOrderProduct(
                                    index,
                                    "quantity",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-16 text-center text-sm"
                              />
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="font-medium text-sm">
                                {product.price > 0
                                  ? formatCurrency(
                                      product.price * product.quantity
                                    )
                                  : "-"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProductFromOrder(index)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end border-t pt-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        Tổng cộng: {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ghi chú */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={newOrder.notes}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, notes: e.target.value })
                }
                placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOrderOpen(false);
                resetAddOrderForm();
              }}
            >
              Hủy
            </Button>
            {/* <Button onClick={handleAddOrder}>Tạo đơn hàng</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>
            Chi tiết đơn hàng{" "}
            {selectedItem?.orderDetails
              ?.slice(1)
              .map((detail) => detail.id)
              .join(", ")}
          </DialogTitle>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Thông tin đơn hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin đơn hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mã đơn hàng
                    </Label>
                    <p className="font-medium">{selectedItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Ngày đặt hàng
                    </Label>
                    <p>{selectedItem.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </Label>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phương thức thanh toán
                    </Label>
                    <Badge variant="outline">
                      {selectedItem.paymentMethod}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tên khách hàng
                    </Label>
                    <p className="font-medium">{selectedItem.customer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p>{selectedItem.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Số điện thoại
                    </Label>
                    <p>{selectedItem.phoneNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Địa chỉ giao hàng
                    </Label>
                    <p>{selectedItem.address}</p>
                  </div>
                </div>
              </div>

              {/* Sản phẩm trong đơn hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sản phẩm đã đặt</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã sản phẩm</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItem?.orderDetails &&
                      selectedItem.orderDetails.length > 0 ? (
                        selectedItem.orderDetails.map((detail, index) => (
                          <TableRow key={detail.id || index}>
                            <TableCell className="font-medium">
                              {detail.productId}
                            </TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>
                              {formatCurrency(detail.unitPrice)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(detail.subTotal)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Không có sản phẩm nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      Tổng cộng:{" "}
                      {formatCurrency(selectedItem?.totalAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedItem.notes && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Ghi chú</h3>
                  <p className="text-muted-foreground">{selectedItem.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Đóng</Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              In hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog cập nhật trạng thái đơn hàng */}
      <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
        <DialogContent>
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
            <div className="grid gap-2">
              <Label htmlFor="order-note">Ghi chú cập nhật</Label>
              <Textarea
                id="order-note"
                placeholder="Ghi chú về việc cập nhật trạng thái..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOrderOpen(false)}>
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
function setOrderNote(arg0: string) {
  throw new Error("Function not implemented.");
}
