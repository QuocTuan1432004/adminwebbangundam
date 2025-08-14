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

// Import API functions
import { 
  createProduct, 
  updateProduct, 
  getAllProducts, 
  deleteProduct,
  type Product 
} from "@/hooks/product/product"
import { 
  createProductImage, 
  getAllProductImages, 
  deleteProductImage,
  type ProductImage 
} from "@/hooks/product/productImage"
import { 
  createProductDetail, 
  updateProductDetail, 
  getProductDetail,
  type ProductDetail 
} from "@/hooks/product/productDetail"
import {
  getAllSubCategories,
  type SubCategory
} from "@/hooks/category/SubCategory"

export function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [subCategories, setSubCategories] = React.useState<SubCategory[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
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
  const [editProductImages, setEditProductImages] = React.useState<ProductImage[]>([])
  const [editThumbnailImage, setEditThumbnailImage] = React.useState<string>("")
  const [editNewDetailImage, setEditNewDetailImage] = React.useState<string>("")
  const [editImageUploadKey, setEditImageUploadKey] = React.useState(0)

  // Form data states
  const [formData, setFormData] = React.useState({
    productName: "",
    price: 0,
    description: "",
    stockQuantity: 0,
    status: "active",
    subCategoryId: "",
    // Product detail fields
    manufacturer: "",
    material: "",
    ratio: "",
    origin: "",
    quantityOfPack: 1,
    height: "",
  })

  const [editFormData, setEditFormData] = React.useState({
    productName: "",
    price: 0,
    description: "",
    stockQuantity: 0,
    status: "active",
    subCategoryId: "",
    // Product detail fields
    manufacturer: "",
    material: "",
    ratio: "",
    origin: "",
    quantityOfPack: 1,
    height: "",
  })

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

  // Load all products
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const products = await getAllProducts()
      setProducts(products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Load all subcategories
  const loadSubCategories = async () => {
    try {
      const subCategories = await getAllSubCategories()
      setSubCategories(subCategories)
    } catch (err) {
      console.error('Lỗi khi tải danh mục con:', err)
    }
  }

  // Get subcategory name by ID - cập nhật để sử dụng subcategory từ product
  const getSubCategoryName = (product: Product) => {
    if (product.subcategory) {
      return `${product.subcategory.subCategoryName} (${product.subcategory.mainCategory.categoryName})`
    }
    // Fallback cho trường hợp không có subcategory data
    const subCategory = subCategories.find(sc => sc.id === product.subCategoryId)
    return subCategory ? subCategory.subCategoryName : product.subCategoryId || 'N/A'
  }

  // Load products and subcategories on component mount
  React.useEffect(() => {
    loadProducts()
    loadSubCategories()
  }, [])

  // Function để thêm ảnh chi tiết
  const addProductImage = () => {
    if (newDetailImage) {
      setProductImages([...productImages, newDetailImage])
      setNewDetailImage("")
      setImageUploadKey(prev => prev + 1)
    }
  }

  const [imageUploadKey, setImageUploadKey] = React.useState(0)

  // Function để xóa ảnh chi tiết
  const removeProductImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index)
    setProductImages(newImages)
  }

  // Functions riêng cho chỉnh sửa
  const addEditProductImage = () => {
    if (editNewDetailImage) {
      // Thêm vào danh sách ảnh mới thay vì productImages
      setProductImages([...productImages, editNewDetailImage])
      setEditNewDetailImage("")
      setEditImageUploadKey(prev => prev + 1)
    }
  }

  const removeEditProductImage = async (index: number, productImg: ProductImage) => {
    try {
      setLoading(true)
      // Gọi API xóa ảnh
      await deleteProductImage(productImg.id)
      
      // Cập nhật state
      const newImages = editProductImages.filter((_, i) => i !== index)
      setEditProductImages(newImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa ảnh')
    } finally {
      setLoading(false)
    }
  }

  // Function để xóa ảnh mới được thêm vào (chưa save)
  const removeNewProductImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index)
    setProductImages(newImages)
  }

  // Handle create product
  const handleCreateProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      if (!formData.productName || !formData.subCategoryId || !thumbnailImage) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc')
      }

      // Convert thumbnail URL to File (assuming you have a function to do this)
      const thumbnailFile = await urlToFile(thumbnailImage, 'thumbnail.jpg')

      // 1. Tạo product trước
      const newProduct = await createProduct(
        formData.subCategoryId,
        {
          productName: formData.productName,
          price: formData.price,
          description: formData.description,
          stockQuantity: formData.stockQuantity,
          status: formData.status,
        },
        thumbnailFile
      )

      // 2. Tạo product detail
      if (formData.manufacturer || formData.material || formData.ratio) {
        await createProductDetail(newProduct.id, {
          manufacturer: formData.manufacturer,
          material: formData.material,
          ratio: formData.ratio,
          origin: formData.origin,
          quantityOfPack: formData.quantityOfPack,
          height: formData.height,
        })
      }

      // 3. Tạo product images
      for (const imageUrl of productImages) {
        const imageFile = await urlToFile(imageUrl, `detail-${Date.now()}.jpg`)
        await createProductImage(newProduct.id, imageFile)
      }

      // Reset form and close dialog
      resetAddForm()
      setIsAddProductOpen(false)
      
      // Reload products
      await loadProducts()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)
      setError(null)

      let thumbnailFile: File | undefined
      if (editThumbnailImage && editThumbnailImage !== selectedItem.thumbnail) {
        thumbnailFile = await urlToFile(editThumbnailImage, 'thumbnail.jpg')
      }

      // 1. Cập nhật product
      await updateProduct(
        selectedItem.id,
        {
          productName: editFormData.productName,
          price: editFormData.price,
          description: editFormData.description,
          status: editFormData.status,
          subCategoryId: editFormData.subCategoryId,
          stockQuantity: editFormData.stockQuantity,
        },
        thumbnailFile
      )

      // 2. Cập nhật product detail (nếu có)
      if (selectedItem.productDetailId) {
        await updateProductDetail(selectedItem.productDetailId, {
          manufacturer: editFormData.manufacturer,
          material: editFormData.material,
          ratio: editFormData.ratio,
          origin: editFormData.origin,
          quantityOfPack: editFormData.quantityOfPack,
          height: editFormData.height,
        })
      }

      // 3. Thêm ảnh mới (nếu có)
      for (const imageUrl of productImages) {
        // Kiểm tra xem ảnh này đã tồn tại chưa
        const existingImage = editProductImages.find(img => img.productImg === imageUrl)
        if (!existingImage) {
          const imageFile = await urlToFile(imageUrl, `detail-${Date.now()}.jpg`)
          await createProductImage(selectedItem.id, imageFile)
        }
      }

      // Reset and close
      resetEditForm()
      setIsEditProductOpen(false)
      
      // Reload products
      await loadProducts()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!itemToDelete) return

    try {
      setLoading(true)
      setError(null)
      
      await deleteProduct(itemToDelete.id)
      
      setIsDeleteConfirmOpen(false)
      setItemToDelete(null)
      
      // Reload products
      await loadProducts()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Khi mở dialog edit, load dữ liệu hiện có
  const handleOpenEditDialog = async (product: any) => {
    try {
      setLoading(true)
      setSelectedItem(product)
      
      // Load product images
      const images = await getAllProductImages(product.id)
      setEditProductImages(images)
      
      // Load product detail if exists
      let productDetail: ProductDetail | null = null
      try {
        productDetail = await getProductDetail(product.id)
      } catch {
        // Product detail doesn't exist, that's fine
      }

      // Set form data
      setEditFormData({
        productName: product.productName,
        price: product.price,
        description: product.description,
        stockQuantity: product.stockQuantity,
        status: product.status,
        subCategoryId: product.subCategoryId || "",
        manufacturer: productDetail?.manufacturer || "",
        material: productDetail?.material || "",
        ratio: productDetail?.ratio || "",
        origin: productDetail?.origin || "",
        quantityOfPack: productDetail?.quantityOfPack || 1,
        height: productDetail?.height || "",
      })

      setEditThumbnailImage(product.thumbnail || "")
      setProductImages(images.map(img => img.productImg))
      setEditNewDetailImage("")
      setEditImageUploadKey(0)
      setIsEditProductOpen(true)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Reset form functions
  const resetAddForm = () => {
    setFormData({
      productName: "",
      price: 0,
      description: "",
      stockQuantity: 0,
      status: "active",
      subCategoryId: "",
      manufacturer: "",
      material: "",
      ratio: "",
      origin: "",
      quantityOfPack: 1,
      height: "",
    })
    setProductImages([])
    setThumbnailImage("")
    setNewDetailImage("")
    setImageUploadKey(0)
  }

  const resetEditForm = () => {
    setEditFormData({
      productName: "",
      price: 0,
      description: "",
      stockQuantity: 0,
      status: "active",
      subCategoryId: "",
      manufacturer: "",
      material: "",
      ratio: "",
      origin: "",
      quantityOfPack: 1,
      height: "",
    })
    setEditProductImages([])
    setEditThumbnailImage("")
    setEditNewDetailImage("")
    setEditImageUploadKey(0)
    setProductImages([]) // Reset cả ảnh mới thêm
  }

  // Utility function to convert URL to File
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
                      <Input 
                        id="product-name" 
                        placeholder="VD: RG RX-78-2 Gundam"
                        value={formData.productName}
                        onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-category">Danh mục</Label>
                      <Select 
                        value={formData.subCategoryId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subCategoryId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map((subCategory) => (
                            <SelectItem key={subCategory.id} value={subCategory.id}>
                              {subCategory.subCategoryName} ({subCategory.mainCategory.categoryName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-price">Giá (VNĐ)</Label>
                      <Input 
                        id="product-price" 
                        type="number" 
                        placeholder="650000"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-stock">Số lượng</Label>
                      <Input 
                        id="product-stock" 
                        type="number" 
                        placeholder="25"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-status">Trạng thái</Label>
                      <Select 
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      >
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
                    <Textarea 
                      id="product-description" 
                      placeholder="Mô tả chi tiết sản phẩm" 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
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
                      <Input 
                        id="product-height" 
                        placeholder="18"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-material">Chất liệu</Label>
                      <Input 
                        id="product-material" 
                        placeholder="Nhựa PS, ABS"
                        value={formData.material}
                        onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-scale">Tỷ lệ</Label>
                      <Input 
                        id="product-scale" 
                        placeholder="1/144"
                        value={formData.ratio}
                        onChange={(e) => setFormData(prev => ({ ...prev, ratio: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-manufacturer">Nhà sản xuất</Label>
                      <Input 
                        id="product-manufacturer" 
                        placeholder="Bandai"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-origin">Xuất xứ</Label>
                      <Input 
                        id="product-origin" 
                        placeholder="Nhật Bản"
                        value={formData.origin}
                        onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-pack-quantity">Số lượng pack</Label>
                      <Input 
                        id="product-pack-quantity" 
                        type="number" 
                        placeholder="1"
                        value={formData.quantityOfPack}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantityOfPack: Number(e.target.value) }))}
                      />
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

                  {/* Form thêm ảnh mới */}
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
                            key={imageUploadKey}
                            value={newDetailImage}
                            onChange={setNewDetailImage}
                            onRemove={() => setNewDetailImage("")}
                            label="📸 Chọn ảnh từ thiết bị"
                            description=""
                          />
                        </div>
                      </div>
                      
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
                  resetAddForm()
                }}>
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleCreateProduct}
                  disabled={loading}
                >
                  {loading ? "Đang tạo..." : "Thêm sản phẩm"}
                </Button>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Không có sản phẩm nào</TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.thumbnail || "/placeholder.svg"}
                          alt={product.productName}
                          className="w-12 h-12 rounded"
                        />
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getSubCategoryName(product)}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <span className={product.stockQuantity < 10 ? "text-red-600 font-medium" : ""}>{product.stockQuantity}</span>
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
                ))
              )}
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
                    <p className="font-medium">{selectedItem.productName}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Danh mục</Label>
                    <Badge variant="outline">{selectedItem.subcategory.subCategoryName}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Giá</Label>
                    <p className="font-medium">{formatCurrency(selectedItem.price)}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Số lượng</Label>
                    <p className={selectedItem.stockQuantity < 10 ? "text-red-600 font-medium" : ""}>{selectedItem.stockQuantity}</p>
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
                    alt={selectedItem.productName}
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
                    <p>{selectedItem.ratio || "N/A"}</p>
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
                    <p className="text-muted-foreground">
                      {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString('vi-VN') : "N/A"}
                    </p>
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
                      value={editFormData.productName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, productName: e.target.value }))}
                      placeholder="VD: RG RX-78-2 Gundam"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-category">Danh mục</Label>
                    <Select 
                      value={editFormData.subCategoryId}
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, subCategoryId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((subCategory) => (
                          <SelectItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.subCategoryName} ({subCategory.mainCategory.categoryName})
                          </SelectItem>
                        ))}
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
                      value={editFormData.price}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="650000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-stock">Số lượng</Label>
                    <Input 
                      id="edit-product-stock" 
                      type="number" 
                      value={editFormData.stockQuantity}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                      placeholder="25" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-status">Trạng thái</Label>
                    <Select 
                      value={editFormData.status}
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                    >
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
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
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
                      value={editFormData.height}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="18" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-material">Chất liệu</Label>
                    <Input 
                      id="edit-product-material" 
                      value={editFormData.material}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, material: e.target.value }))}
                      placeholder="Nhựa PS, ABS" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-scale">Tỷ lệ</Label>
                    <Input 
                      id="edit-product-scale" 
                      value={editFormData.ratio}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, ratio: e.target.value }))}
                      placeholder="1/144" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-manufacturer">Nhà sản xuất</Label>
                    <Input 
                      id="edit-product-manufacturer" 
                      value={editFormData.manufacturer}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                      placeholder="Bandai" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-origin">Xuất xứ</Label>
                    <Input 
                      id="edit-product-origin" 
                      value={editFormData.origin}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, origin: e.target.value }))}
                      placeholder="Nhật Bản" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-pack-quantity">Số lượng pack</Label>
                    <Input 
                      id="edit-product-pack-quantity" 
                      type="number" 
                      value={editFormData.quantityOfPack}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, quantityOfPack: Number(e.target.value) }))
                      }
                      placeholder="1" 
                    />
                  </div>
                </div>
              </div>

              {/* Ảnh chi tiết sản phẩm - Sử dụng cấu trúc giống thêm mới */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ảnh chi tiết sản phẩm</h3>
                
                {/* Ảnh đã có sẵn trong database */}
                {editProductImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">Ảnh hiện có ({editProductImages.length} ảnh)</Label>
                      <Badge variant="outline" className="text-xs">Đã lưu</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      {editProductImages.map((productImg, index) => (
                        <div key={productImg.id} className="relative group">
                          <img
                            src={productImg.productImg}
                            alt={`Product detail ${index + 1}`}
                            className="w-full h-24 object-cover rounded border-2 border-blue-300"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeEditProductImage(index, productImg)}
                            disabled={loading}
                            title="Xóa ảnh khỏi database"
                          >
                            ×
                          </Button>
                          <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 Những ảnh này đã được lưu trong database. Bấm "×" để xóa vĩnh viễn.
                    </p>
                  </div>
                )}

                {/* Ảnh mới được thêm vào (chưa save) */}
                {productImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">Ảnh mới thêm ({productImages.length} ảnh)</Label>
                      <Badge variant="secondary" className="text-xs">Chưa lưu</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      {productImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`New product detail ${index + 1}`}
                            className="w-full h-24 object-cover rounded border-2 border-green-300"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeNewProductImage(index)}
                            title="Bỏ ảnh khỏi danh sách thêm mới"
                          >
                            ×
                          </Button>
                          <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1 rounded">
                            +{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      💡 Những ảnh này sẽ được thêm vào khi bạn lưu. Bấm "×" để bỏ khỏi danh sách.
                    </p>
                  </div>
                )}

                {/* Khu vực không có ảnh nào */}
                {editProductImages.length === 0 && productImages.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">Chưa có ảnh chi tiết nào</p>
                  </div>
                )}

                {/* Form thêm ảnh mới */}
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
                          key={editImageUploadKey}
                          value={editNewDetailImage}
                          onChange={setEditNewDetailImage}
                          onRemove={() => setEditNewDetailImage("")}
                          label="📸 Chọn ảnh từ thiết bị"
                          description=""
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="button"
                      onClick={addEditProductImage}
                      disabled={!editNewDetailImage || loading}
                      className="w-full max-w-sm"
                      size="lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Thêm ảnh này vào danh sách
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditProductOpen(false)
              resetEditForm()
            }}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateProduct}
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
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
              Bạn có chắc chắn muốn xóa sản phẩm "{itemToDelete?.productName}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={loading}
            >
              {loading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Các dialog khác giữ nguyên */}
    </div>
  )
}
