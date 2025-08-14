"use client"

import * as React from "react"
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Search, Filter, Upload, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"

// Mock data
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
]

export function ProductsPage() {
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = React.useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<any>(null)

  const [productImages, setProductImages] = React.useState<string[]>([])
  const [thumbnailImage, setThumbnailImage] = React.useState<string>("")
  const [newDetailImage, setNewDetailImage] = React.useState<string>("")
  
  // Thêm states riêng cho chỉnh sửa
  const [editProductImages, setEditProductImages] = React.useState<string[]>([])
  const [editThumbnailImage, setEditThumbnailImage] = React.useState<string>("")
  const [editNewDetailImage, setEditNewDetailImage] = React.useState<string>("")
  const [editImageUploadKey, setEditImageUploadKey] = React.useState(0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Hoạt động", variant: "default" as const },
      inactive: { label: "Không hoạt động", variant: "secondary" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  // Function để thêm ảnh chi tiết - Cải thiện
  const addProductImage = () => {
    if (newDetailImage) {
      setProductImages([...productImages, newDetailImage])
      setNewDetailImage("") // Reset state
      
      // Force re-render ImageUpload component bằng cách reset key
      setImageUploadKey(prev => prev + 1)
    }
  }

  // Thêm state để force re-render ImageUpload
  const [imageUploadKey, setImageUploadKey] = React.useState(0)

  // Function để xóa ảnh chi tiết
  const removeProductImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index)
    setProductImages(newImages)
  }

  // Functions riêng cho chỉnh sửa
  const addEditProductImage = () => {
    if (editNewDetailImage) {
      setEditProductImages([...editProductImages, editNewDetailImage])
      setEditNewDetailImage("") // Reset state
      
      // Force re-render ImageUpload component bằng cách reset key
      setEditImageUploadKey(prev => prev + 1)
    }
  }

  const removeEditProductImage = (index: number) => {
    const newImages = editProductImages.filter((_, i) => i !== index)
    setEditProductImages(newImages)
  }

  // Khi mở dialog edit, load ảnh hiện có
  const handleOpenEditDialog = (product: any) => {
    setSelectedItem(product)
    setEditThumbnailImage(product.thumbnail || "")
    setEditProductImages(product.detailImages || [])
    setEditNewDetailImage("")
    setEditImageUploadKey(0)
    setIsEditProductOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
          <p className="text-muted-foreground">Quản lý tất cả sản phẩm Gundam</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogDescription>Thêm sản phẩm Gundam mới vào cửa hàng</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Thông tin cơ bản */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-name">Tên sản phẩm</Label>
                      <Input id="product-name" placeholder="VD: RG RX-78-2 Gundam" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-category">Danh mục</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rg">Real Grade (RG)</SelectItem>
                          <SelectItem value="mg">Master Grade (MG)</SelectItem>
                          <SelectItem value="pg">Perfect Grade (PG)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-price">Giá (VNĐ)</Label>
                      <Input id="product-price" type="number" placeholder="650000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-stock">Số lượng</Label>
                      <Input id="product-stock" type="number" placeholder="25" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-status">Trạng thái</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                          <SelectItem value="draft">Bản nháp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-description">Mô tả</Label>
                    <Textarea id="product-description" placeholder="Mô tả chi tiết sản phẩm" rows={3} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Ảnh đại diện chính</Label>
                    <ImageUpload
                      value={thumbnailImage}
                      onChange={setThumbnailImage}
                      onRemove={() => setThumbnailImage("")}
                      label="Ảnh đại diện"
                      description="Ảnh chính hiển thị trong danh sách sản phẩm (khuyến nghị 400x400px)"
                    />
                  </div>
                </div>

                {/* Thông tin kỹ thuật */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin kỹ thuật</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-height">Chiều cao (cm)</Label>
                      <Input id="product-height" type="number" placeholder="18" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-weight">Trọng lượng (g)</Label>
                      <Input id="product-weight" type="number" placeholder="250" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-material">Chất liệu</Label>
                      <Input id="product-material" placeholder="Nhựa PS, ABS" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-scale">Tỷ lệ</Label>
                      <Input id="product-scale" placeholder="1/144" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-manufacturer">Nhà sản xuất</Label>
                      <Input id="product-manufacturer" placeholder="Bandai" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-pack-quantity">Số lượng pack</Label>
                      <Input id="product-pack-quantity" type="number" placeholder="1" />
                    </div>
                  </div>
                </div>

                {/* Hình ảnh chi tiết */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ảnh chi tiết sản phẩm</h3>
                  
                  {/* Danh sách ảnh đã thêm */}
                  {productImages.length > 0 && (
                    <div className="space-y-3">
                      <Label>Ảnh đã thêm ({productImages.length} ảnh)</Label>
                      <div className="grid grid-cols-4 gap-4">
                        {productImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Product detail ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeProductImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form thêm ảnh mới - Improved layout */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 bg-muted/10">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="text-center space-y-1">
                        <Label className="text-lg font-medium">Thêm ảnh chi tiết mới</Label>
                        <p className="text-sm text-muted-foreground">
                          Chọn ảnh chi tiết để khách hàng xem sản phẩm từ nhiều góc độ
                        </p>
                      </div>
                      
                      <div className="w-full max-w-lg">
                        <div className="flex justify-center">
                          <ImageUpload
                            key={imageUploadKey} // Key này sẽ force component re-mount
                            value={newDetailImage}
                            onChange={setNewDetailImage}
                            onRemove={() => setNewDetailImage("")}
                            label="📸 Chọn ảnh từ thiết bị"
                            description=""
                          />
                        </div>
                      </div>
                      
                      {/* Nút thêm ảnh */}
                      <Button 
                        type="button"
                        onClick={addProductImage}
                        disabled={!newDetailImage}
                        className="w-full max-w-sm"
                        size="lg"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Thêm ảnh này vào danh sách
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      💡 Bạn có thể thêm không giới hạn ảnh chi tiết để khách hàng có cái nhìn toàn diện về sản phẩm
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddProductOpen(false)
                  setProductImages([])
                  setThumbnailImage("")
                  setNewDetailImage("")
                  setImageUploadKey(0) // Reset key khi đóng dialog
                }}>
                  Hủy
                </Button>
                <Button type="submit">Thêm sản phẩm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Tìm kiếm sản phẩm..." className="max-w-sm" />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
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
                            setSelectedItem(product)
                            setIsViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditDialog(product)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setItemToDelete(product)
                            setIsDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết - Cải thiện */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Tên sản phẩm</Label>
                    <p className="font-medium">{selectedItem.name}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Danh mục</Label>
                    <Badge variant="outline">{selectedItem.category}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Giá</Label>
                    <p className="font-medium">{formatCurrency(selectedItem.price)}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Số lượng</Label>
                    <p className={selectedItem.stock < 10 ? "text-red-600 font-medium" : ""}>{selectedItem.stock}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Trạng thái</Label>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Mô tả</Label>
                  <p className="text-sm">{selectedItem.description || "Chưa có mô tả"}</p>
                </div>
                <div className="grid gap-2">
                  <Label>Ảnh đại diện</Label>
                  <img
                    src={selectedItem.thumbnail || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="w-32 h-32 rounded object-cover border"
                  />
                </div>
              </div>

              {/* Thông tin kỹ thuật */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin kỹ thuật</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Chiều cao</Label>
                    <p>{selectedItem.height || "N/A"} cm</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Trọng lượng</Label>
                    <p>{selectedItem.weight || "N/A"} g</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Chất liệu</Label>
                    <p>{selectedItem.material || "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Tỷ lệ</Label>
                    <p>{selectedItem.scale || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Nhà sản xuất</Label>
                    <p>{selectedItem.manufacturer || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Số lượng pack</Label>
                    <p>{selectedItem.packQuantity || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Ảnh chi tiết */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ảnh chi tiết sản phẩm</h3>
                {selectedItem.detailImages && selectedItem.detailImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {selectedItem.detailImages.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product detail ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Chưa có ảnh chi tiết</p>
                )}
              </div>

              {/* Thông tin khác */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin khác</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>ID sản phẩm</Label>
                    <p className="text-muted-foreground">{selectedItem.id}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Ngày tạo</Label>
                    <p className="text-muted-foreground">{selectedItem.createdAt || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa sản phẩm - Cải thiện */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-name">Tên sản phẩm</Label>
                    <Input
                      id="edit-product-name"
                      defaultValue={selectedItem.name}
                      placeholder="VD: RG RX-78-2 Gundam"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-category">Danh mục</Label>
                    <Select defaultValue={selectedItem.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Real Grade">Real Grade (RG)</SelectItem>
                        <SelectItem value="Master Grade">Master Grade (MG)</SelectItem>
                        <SelectItem value="Perfect Grade">Perfect Grade (PG)</SelectItem>
                        <SelectItem value="High Grade">High Grade (HG)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-price">Giá (VNĐ)</Label>
                    <Input
                      id="edit-product-price"
                      type="number"
                      defaultValue={selectedItem.price}
                      placeholder="650000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-stock">Số lượng</Label>
                    <Input 
                      id="edit-product-stock" 
                      type="number" 
                      defaultValue={selectedItem.stock} 
                      placeholder="25" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-status">Trạng thái</Label>
                    <Select defaultValue={selectedItem.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-product-description">Mô tả</Label>
                  <Textarea 
                    id="edit-product-description" 
                    defaultValue={selectedItem.description || ""}
                    placeholder="Mô tả chi tiết sản phẩm" 
                    rows={3} 
                  />
                </div>
                
                {/* Ảnh đại diện chính - Sử dụng cấu trúc giống thêm mới */}
                <div className="grid gap-2">
                  <Label>Ảnh đại diện chính</Label>
                  <ImageUpload
                    value={editThumbnailImage}
                    onChange={setEditThumbnailImage}
                    onRemove={() => setEditThumbnailImage("")}
                    label="Ảnh đại diện"
                    description="Ảnh chính hiển thị trong danh sách sản phẩm (khuyến nghị 400x400px)"
                  />
                </div>
              </div>

              {/* Thông tin kỹ thuật */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin kỹ thuật</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-height">Chiều cao (cm)</Label>
                    <Input 
                      id="edit-product-height" 
                      type="number" 
                      defaultValue={selectedItem.height || ""}
                      placeholder="18" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-weight">Trọng lượng (g)</Label>
                    <Input 
                      id="edit-product-weight" 
                      type="number" 
                      defaultValue={selectedItem.weight || ""}
                      placeholder="250" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-material">Chất liệu</Label>
                    <Input 
                      id="edit-product-material" 
                      defaultValue={selectedItem.material || ""}
                      placeholder="Nhựa PS, ABS" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-scale">Tỷ lệ</Label>
                    <Input 
                      id="edit-product-scale" 
                      defaultValue={selectedItem.scale || ""}
                      placeholder="1/144" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-manufacturer">Nhà sản xuất</Label>
                    <Input 
                      id="edit-product-manufacturer" 
                      defaultValue={selectedItem.manufacturer || ""}
                      placeholder="Bandai" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-pack-quantity">Số lượng pack</Label>
                    <Input 
                      id="edit-product-pack-quantity" 
                      type="number" 
                      defaultValue={selectedItem.packQuantity || ""}
                      placeholder="1" 
                    />
                  </div>
                </div>
              </div>

              {/* Ảnh chi tiết sản phẩm - Sử dụng cấu trúc giống thêm mới */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ảnh chi tiết sản phẩm</h3>
                
                {/* Danh sách ảnh đã thêm */}
                {editProductImages.length > 0 && (
                  <div className="space-y-3">
                    <Label>Ảnh đã thêm ({editProductImages.length} ảnh)</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {editProductImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product detail ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeEditProductImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form thêm ảnh mới - Improved layout */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 bg-muted/10">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="text-center space-y-1">
                      <Label className="text-lg font-medium">Thêm ảnh chi tiết mới</Label>
                      <p className="text-sm text-muted-foreground">
                        Chọn ảnh chi tiết để khách hàng xem sản phẩm từ nhiều góc độ
                      </p>
                    </div
                    >
                    <div className="w-full max-w-lg">
                      <div className="flex justify-center">
                        <ImageUpload
                          key={editImageUploadKey} // Key này sẽ force component re-mount
                          value={editNewDetailImage}
                          onChange={setEditNewDetailImage}
                          onRemove={() => setEditNewDetailImage("")}
                          label="📸 Chọn ảnh từ thiết bị"
                          description=""
                        />
                      </div>
                    </div>
                    
                    {/* Nút thêm ảnh */}
                    <Button 
                      type="button"
                      onClick={addEditProductImage}
                      disabled={!editNewDetailImage}
                      className="w-full max-w-sm"
                      size="lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Thêm ảnh này vào danh sách
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    💡 Bạn có thể thêm không giới hạn ảnh chi tiết để khách hàng có cái nhìn toàn diện về sản phẩm
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditProductOpen(false)
              setEditProductImages([])
              setEditThumbnailImage("")
              setEditNewDetailImage("")
              setEditImageUploadKey(0)
            }}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={() => {
                console.log("Cập nhật sản phẩm:", selectedItem)
                console.log("Ảnh đại diện:", editThumbnailImage)
                console.log("Ảnh chi tiết:", editProductImages)
                setIsEditProductOpen(false)
                setSelectedItem(null)
              }}
            >
              Cập nhật sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa - không thay đổi */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{itemToDelete?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("Xóa sản phẩm:", itemToDelete)
                setIsDeleteConfirmOpen(false)
                setItemToDelete(null)
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
