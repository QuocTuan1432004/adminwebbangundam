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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-price">Giá (VNĐ)</Label>
                      <Input id="product-price" type="number" placeholder="650000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-stock">Số lượng</Label>
                      <Input id="product-stock" type="number" placeholder="25" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-description">Mô tả</Label>
                    <Textarea id="product-description" placeholder="Mô tả chi tiết sản phẩm" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-manufacturer">Nhà sản xuất</Label>
                      <Input id="product-manufacturer" placeholder="Bandai" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-scale">Tỷ lệ</Label>
                      <Input id="product-scale" placeholder="1/144" />
                    </div>
                  </div>
                </div>

                {/* Hình ảnh sản phẩm */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hình ảnh sản phẩm</h3>

                  {/* Ảnh thumbnail chính */}
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

                  {/* Ảnh chi tiết */}
                  <div className="grid gap-2">
                    <Label>Ảnh chi tiết sản phẩm</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((index) => (
                        <ImageUpload
                          key={index}
                          value={productImages[index] || ""}
                          onChange={(value) => {
                            const newImages = [...productImages]
                            newImages[index] = value
                            setProductImages(newImages)
                          }}
                          onRemove={() => {
                            const newImages = [...productImages]
                            newImages[index] = ""
                            setProductImages(newImages)
                          }}
                          label={`Ảnh ${index + 1}`}
                          description=""
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Thêm tối đa 4 ảnh chi tiết để khách hàng có thể xem sản phẩm từ nhiều góc độ
                    </p>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-release-date">Ngày phát hành</Label>
                      <Input id="product-release-date" type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-series">Series</Label>
                      <Input id="product-series" placeholder="Mobile Suit Gundam" />
                    </div>
                  </div>
                </div>

                {/* Trạng thái và SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Trạng thái và SEO</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid gap-2">
                      <Label htmlFor="product-featured">Sản phẩm nổi bật</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Có</SelectItem>
                          <SelectItem value="no">Không</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-tags">Tags (phân cách bằng dấu phẩy)</Label>
                    <Input id="product-tags" placeholder="gundam, robot, mô hình, bandai" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-meta-description">Meta Description (SEO)</Label>
                    <Textarea
                      id="product-meta-description"
                      placeholder="Mô tả ngắn gọn cho SEO (150-160 ký tự)"
                      rows={2}
                      maxLength={160}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
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
                          onClick={() => {
                            setSelectedItem(product)
                            setIsEditProductOpen(true)
                          }}
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

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              {Object.entries(selectedItem).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}:</Label>
                  <div className="col-span-2">
                    {key === "thumbnail" && value ? (
                      <img src={(value as string) || "/placeholder.svg"} alt="Product" className="w-16 h-16 rounded" />
                    ) : key.includes("price") ? (
                      <p className="font-medium">{formatCurrency(Number(value))}</p>
                    ) : key.includes("status") ? (
                      getStatusBadge(value as string)
                    ) : (
                      <p className={key === "id" ? "text-muted-foreground" : ""}>{String(value)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
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

      {/* Dialog chỉnh sửa sản phẩm */}
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
                <div className="grid grid-cols-2 gap-4">
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
                    <Input id="edit-product-stock" type="number" defaultValue={selectedItem.stock} placeholder="25" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-product-description">Mô tả</Label>
                  <Textarea id="edit-product-description" placeholder="Mô tả chi tiết sản phẩm" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-manufacturer">Nhà sản xuất</Label>
                    <Input id="edit-product-manufacturer" placeholder="Bandai" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-scale">Tỷ lệ</Label>
                    <Input id="edit-product-scale" placeholder="1/144" />
                  </div>
                </div>
              </div>

              {/* Hình ảnh sản phẩm */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hình ảnh sản phẩm</h3>

                {/* Ảnh thumbnail hiện tại */}
                <div className="grid gap-2">
                  <Label>Ảnh đại diện hiện tại</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedItem.thumbnail || "/placeholder.svg"}
                      alt="Current thumbnail"
                      className="w-24 h-24 rounded object-cover border"
                    />
                    <div className="flex-1">
                      <Input type="file" accept="image/*" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Chọn ảnh đại diện mới (khuyến nghị 400x400px) hoặc để trống để giữ ảnh hiện tại
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ảnh chi tiết */}
                <div className="grid gap-2">
                  <Label>Ảnh chi tiết sản phẩm</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="space-y-2">
                        <div className="w-full h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">Ảnh {index + 1}</span>
                        </div>
                        <Input type="file" accept="image/*" className="text-xs" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Cập nhật ảnh chi tiết (tối đa 4 ảnh)</p>
                </div>
              </div>

              {/* Thông tin kỹ thuật */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin kỹ thuật</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-height">Chiều cao (cm)</Label>
                    <Input id="edit-product-height" type="number" placeholder="18" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-weight">Trọng lượng (g)</Label>
                    <Input id="edit-product-weight" type="number" placeholder="250" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-material">Chất liệu</Label>
                    <Input id="edit-product-material" placeholder="Nhựa PS, ABS" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-release-date">Ngày phát hành</Label>
                    <Input id="edit-product-release-date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-series">Series</Label>
                    <Input id="edit-product-series" placeholder="Mobile Suit Gundam" />
                  </div>
                </div>
              </div>

              {/* Trạng thái và SEO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Trạng thái và SEO</h3>
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-featured">Sản phẩm nổi bật</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Có</SelectItem>
                        <SelectItem value="no">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-product-tags">Tags (phân cách bằng dấu phẩy)</Label>
                  <Input id="edit-product-tags" placeholder="gundam, robot, mô hình, bandai" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-product-meta-description">Meta Description (SEO)</Label>
                  <Textarea
                    id="edit-product-meta-description"
                    placeholder="Mô tả ngắn gọn cho SEO (150-160 ký tự)"
                    rows={2}
                    maxLength={160}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={() => {
                console.log("Cập nhật sản phẩm:", selectedItem)
                setIsEditProductOpen(false)
                setSelectedItem(null)
              }}
            >
              Cập nhật sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
