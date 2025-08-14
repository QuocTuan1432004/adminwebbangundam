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

  // Thêm state để lưu giá trị ban đầu
  const [initialEditFormData, setInitialEditFormData] = React.useState({
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

  const [initialEditThumbnailImage, setInitialEditThumbnailImage] = React.useState<string>("")

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

  // Function để xóa ảnh mới được thêm vào (chưa save) - được sử dụng trong edit dialog
  const removeNewProductImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index)
    setProductImages(newImages)
  }

  // Functions riêng cho chỉnh sửa - cập nhật để gọi API ngay lập tức
  const addEditProductImage = async () => {
    if (!editNewDetailImage || !selectedItem) return
    
    try {
      setLoading(true)
      
      // Convert URL to File
      const imageFile = await urlToFile(editNewDetailImage, `detail-${Date.now()}.jpg`)
      
      // Gọi API tạo ảnh ngay lập tức
      const newProductImage = await createProductImage(selectedItem.id, imageFile)
      
      // Thêm ảnh mới vào danh sách ảnh hiện có
      setEditProductImages(prev => [...prev, newProductImage])
      
      // Reset form
      setEditNewDetailImage("")
      setEditImageUploadKey(prev => prev + 1)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi thêm ảnh')
    } finally {
      setLoading(false)
    }
  }

  const removeEditProductImage = async (index: number, productImg: ProductImage) => {
    try {
      setLoading(true)
      
      // Gọi API xóa ảnh
      await deleteProductImage(productImg.id)
      
      // Cập nhật state - xóa ảnh khỏi danh sách
      const newImages = editProductImages.filter((_, i) => i !== index)
      setEditProductImages(newImages)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa ảnh')
    } finally {
      setLoading(false)
    }
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

  // Handle update product - chỉ gửi những trường có thay đổi
  const handleUpdateProduct = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)
      setError(null)

      let hasAnyChanges = false

      // Kiểm tra thay đổi thumbnail
      let thumbnailFile: File | undefined
      const thumbnailChanged = editThumbnailImage !== initialEditThumbnailImage
      if (thumbnailChanged && editThumbnailImage) {
        thumbnailFile = await urlToFile(editThumbnailImage, 'thumbnail.jpg')
        hasAnyChanges = true
      }

      // Kiểm tra thay đổi trong product data
      const productChanges: Partial<{
        productName: string;
        price: number;
        description: string;
        status: string;
        subCategoryId: string;
        stockQuantity: number;
      }> = {}

      if (editFormData.productName !== initialEditFormData.productName) {
        productChanges.productName = editFormData.productName
      }
      if (editFormData.price !== initialEditFormData.price) {
        productChanges.price = editFormData.price
      }
      if (editFormData.description !== initialEditFormData.description) {
        productChanges.description = editFormData.description
      }
      if (editFormData.status !== initialEditFormData.status) {
        productChanges.status = editFormData.status
      }
      if (editFormData.subCategoryId !== initialEditFormData.subCategoryId) {
        productChanges.subCategoryId = editFormData.subCategoryId
      }
      if (editFormData.stockQuantity !== initialEditFormData.stockQuantity) {
        productChanges.stockQuantity = editFormData.stockQuantity
      }

      // Chỉ cập nhật product nếu có thay đổi
      if (Object.keys(productChanges).length > 0 || thumbnailChanged) {
        // Tạo object chỉ với những field thay đổi + subCategoryId (bắt buộc cho API)
        const updateData: any = {
          subCategoryId: editFormData.subCategoryId, // Required field
          ...productChanges // Chỉ những field thay đổi
        }

        await updateProduct(selectedItem.id, updateData, thumbnailFile)
        console.log('Product updated with changes:', productChanges)
        hasAnyChanges = true
      }

      // Kiểm tra thay đổi trong product detail
      const productDetailChanges: Partial<{
        manufacturer: string;
        material: string;
        ratio: string;
        origin: string;
        quantityOfPack: number;
        height: string;
      }> = {}

      if (editFormData.manufacturer !== initialEditFormData.manufacturer) {
        productDetailChanges.manufacturer = editFormData.manufacturer
      }
      if (editFormData.material !== initialEditFormData.material) {
        productDetailChanges.material = editFormData.material
      }
      if (editFormData.ratio !== initialEditFormData.ratio) {
        productDetailChanges.ratio = editFormData.ratio
      }
      if (editFormData.origin !== initialEditFormData.origin) {
        productDetailChanges.origin = editFormData.origin
      }
      if (editFormData.quantityOfPack !== initialEditFormData.quantityOfPack) {
        productDetailChanges.quantityOfPack = editFormData.quantityOfPack
      }
      if (editFormData.height !== initialEditFormData.height) {
        productDetailChanges.height = editFormData.height
      }

      // Chỉ cập nhật product detail nếu có thay đổi
      if (Object.keys(productDetailChanges).length > 0) {
        if (selectedItem.productDetailId) {
          // Chỉ gửi những field thay đổi
          await updateProductDetail(selectedItem.productDetailId, productDetailChanges)
          console.log('Product detail updated with changes:', productDetailChanges)
          hasAnyChanges = true
        } else {
          // Tạo product detail mới nếu chưa có và có dữ liệu thay đổi
          const hasDetailData = Object.keys(productDetailChanges).length > 0
          
          if (hasDetailData) {
            // Tạo với tất cả data hiện tại (vì là tạo mới)
            await createProductDetail(selectedItem.id, {
              manufacturer: editFormData.manufacturer,
              material: editFormData.material,
              ratio: editFormData.ratio,
              origin: editFormData.origin,
              quantityOfPack: editFormData.quantityOfPack,
              height: editFormData.height,
            })
            console.log('New product detail created')
            hasAnyChanges = true
          }
        }
      }

      // Thông báo nếu không có thay đổi
      if (!hasAnyChanges) {
        console.log('No changes detected - update skipped')
        setError('Không có thay đổi nào để cập nhật')
        setLoading(false)
        return
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

  // Cập nhật handleOpenEditDialog để lưu giá trị ban đầu
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

      // Set form data - Sửa lỗi ở đây
      const formData = {
        productName: product.productName || "",
        price: product.price || 0,
        description: product.description || "",
        stockQuantity: product.stockQuantity || 0,
        status: product.status || "active",
        subCategoryId: product.subCategoryId || product.subcategory?.id || "", // Sửa lỗi
        manufacturer: productDetail?.manufacturer || "",
        material: productDetail?.material || "",
        ratio: productDetail?.ratio || "",
        origin: productDetail?.origin || "",
        quantityOfPack: productDetail?.quantityOfPack || 1,
        height: productDetail?.height || "",
      }

      setEditFormData(formData)
      setInitialEditFormData(formData) // Lưu giá trị ban đầu

      const thumbnailImage = product.thumbnail || ""
      setEditThumbnailImage(thumbnailImage)
      setInitialEditThumbnailImage(thumbnailImage) // Lưu giá trị ban đầu

      setEditNewDetailImage("")
      setEditImageUploadKey(0)
      setIsEditProductOpen(true)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Thêm function để mở dialog xem chi tiết
  const handleOpenViewDialog = async (product: any) => {
    try {
      setLoading(true)
      setSelectedItem(product)
      
      // Load product images
      const images = await getAllProductImages(product.id)
      setEditProductImages(images) // Sử dụng chung state để hiển thị
      
      // Load product detail if exists
      let productDetail: ProductDetail | null = null
      try {
        productDetail = await getProductDetail(product.id)
      } catch {
        // Product detail doesn't exist, that's fine
      }

      // Gán productDetail vào selectedItem để sử dụng trong view
      setSelectedItem({
        ...product,
        productDetail: productDetail,
        productImages: images
      })
      
      setIsViewDetailsOpen(true)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Sửa lỗi trong formData inputs - thêm fallback values
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditFormData(prev => ({ 
      ...prev, 
      price: value === "" ? 0 : Number(value) 
    }))
  }

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditFormData(prev => ({ 
      ...prev, 
      stockQuantity: value === "" ? 0 : Number(value) 
    }))
  }

  const handleQuantityPackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditFormData(prev => ({ 
      ...prev, 
      quantityOfPack: value === "" ? 1 : Number(value) 
    }))
  }

  // Reset form function for add dialog
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

  // Cập nhật resetEditForm
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
    setInitialEditFormData({
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
    setInitialEditThumbnailImage("")
    setEditNewDetailImage("")
    setEditImageUploadKey(0)
  }

  // Utility function to convert URL to File
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  // Thêm component hiển thị thay đổi (optional)
  const renderChangeIndicator = () => {
    const hasProductChanges = 
      editFormData.productName !== initialEditFormData.productName ||
      editFormData.price !== initialEditFormData.price ||
      editFormData.description !== initialEditFormData.description ||
      editFormData.status !== initialEditFormData.status ||
      editFormData.subCategoryId !== initialEditFormData.subCategoryId ||
      editFormData.stockQuantity !== initialEditFormData.stockQuantity

    const hasDetailChanges = 
      editFormData.manufacturer !== initialEditFormData.manufacturer ||
      editFormData.material !== initialEditFormData.material ||
      editFormData.ratio !== initialEditFormData.ratio ||
      editFormData.origin !== initialEditFormData.origin ||
      editFormData.quantityOfPack !== initialEditFormData.quantityOfPack ||
      editFormData.height !== initialEditFormData.height

    const hasThumbnailChanges = editThumbnailImage !== initialEditThumbnailImage

    const hasAnyChanges = hasProductChanges || hasDetailChanges || hasThumbnailChanges

    if (!hasAnyChanges) return null

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-yellow-800">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="font-medium">Có thay đổi chưa lưu</span>
        </div>
        <div className="mt-1 text-xs text-yellow-700">
          {hasProductChanges && <span className="mr-3">• Thông tin cơ bản</span>}
          {hasDetailChanges && <span className="mr-3">• Thông tin kỹ thuật</span>}
          {hasThumbnailChanges && <span className="mr-3">• Ảnh đại diện</span>}
        </div>
      </div>
    )
  }

  // Thêm component hiển thị số lượng thay đổi
  const renderChangesCount = () => {
    const productChangesCount = [
      editFormData.productName !== initialEditFormData.productName,
      editFormData.price !== initialEditFormData.price,
      editFormData.description !== initialEditFormData.description,
      editFormData.status !== initialEditFormData.status,
      editFormData.subCategoryId !== initialEditFormData.subCategoryId,
      editFormData.stockQuantity !== initialEditFormData.stockQuantity,
    ].filter(Boolean).length

    const detailChangesCount = [
      editFormData.manufacturer !== initialEditFormData.manufacturer,
      editFormData.material !== initialEditFormData.material,
      editFormData.ratio !== initialEditFormData.ratio,
      editFormData.origin !== initialEditFormData.origin,
      editFormData.quantityOfPack !== initialEditFormData.quantityOfPack,
      editFormData.height !== initialEditFormData.height,
    ].filter(Boolean).length

    const thumbnailChanged = editThumbnailImage !== initialEditThumbnailImage

    const totalChanges = productChangesCount + detailChangesCount + (thumbnailChanged ? 1 : 0)

    return (
      <div className="text-xs text-muted-foreground">
        {totalChanges > 0 ? (
          <span className="text-orange-600">
            📝 {totalChanges} thay đổi sẽ được lưu
          </span>
        ) : (
          <span className="text-gray-500">
            ✅ Chưa có thay đổi nào
          </span>
        )}
      </div>
    )
  }

  // Thêm function hasChanges
  const hasChanges = () => {
    return (
      (editFormData.productName || "") !== (initialEditFormData.productName || "") ||
      (editFormData.price || 0) !== (initialEditFormData.price || 0) ||
      (editFormData.description || "") !== (initialEditFormData.description || "") ||
      (editFormData.status || "active") !== (initialEditFormData.status || "active") ||
      (editFormData.subCategoryId || "") !== (initialEditFormData.subCategoryId || "") ||
      (editFormData.stockQuantity || 0) !== (initialEditFormData.stockQuantity || 0) ||
      (editFormData.manufacturer || "") !== (initialEditFormData.manufacturer || "") ||
      (editFormData.material || "") !== (initialEditFormData.material || "") ||
      (editFormData.ratio || "") !== (initialEditFormData.ratio || "") ||
      (editFormData.origin || "") !== (initialEditFormData.origin || "") ||
      (editFormData.quantityOfPack || 1) !== (initialEditFormData.quantityOfPack || 1) ||
      (editFormData.height || "") !== (initialEditFormData.height || "") ||
      (editThumbnailImage || "") !== (initialEditThumbnailImage || "")
    )
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
                          <SelectItem value="active">Còn hàng</SelectItem>
                          <SelectItem value="inactive">Hết hàng</SelectItem>
                          <SelectItem value="draft">Chuẩn bị nhập hàng</SelectItem>
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
                            onClick={() => handleOpenViewDialog(product)}
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

      {/* Dialog xem chi tiết - Cập nhật bỏ ngày cập nhật cuối */}
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
                    {selectedItem.subcategory ? (
                      <div className="space-y-1">
                        <Badge variant="outline">
                          {selectedItem.subcategory.subCategoryName}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Thuộc: {selectedItem.subcategory.mainCategory.categoryName}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline">N/A</Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Giá</Label>
                    <p className="font-medium">{formatCurrency(selectedItem.price)}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Số lượng</Label>
                    <p className={selectedItem.stockQuantity < 10 ? "text-red-600 font-medium" : "font-medium"}>
                      {selectedItem.stockQuantity}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Trạng thái</Label>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Mô tả</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded border">
                    {selectedItem.description || "Chưa có mô tả"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Ảnh đại diện</Label>
                  <div className="flex justify-start">
                    <img
                      src={selectedItem.thumbnail || "/placeholder.svg"}
                      alt={selectedItem.productName}
                      className="w-32 h-32 rounded object-cover border shadow-sm"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Ngày tạo</Label>
                  <p className="text-muted-foreground">
                    {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString('vi-VN') : "N/A"}
                  </p>
                </div>
              </div>

              {/* Thông tin kỹ thuật */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin kỹ thuật</h3>
                {selectedItem.productDetail ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label>Chiều cao</Label>
                      <p className="bg-gray-50 p-2 rounded border">
                        {selectedItem.productDetail.height || "N/A"} cm
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Chất liệu</Label>
                      <p className="bg-gray-50 p-2 rounded border">
                        {selectedItem.productDetail.material || "N/A"}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tỷ lệ</Label>
                      <p className="bg-gray-50 p-2 rounded border">
                        {selectedItem.productDetail.ratio || "N/A"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label>Chiều cao</Label>
                      <p className="bg-gray-50 p-2 rounded border text-muted-foreground">N/A</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Chất liệu</Label>
                      <p className="bg-gray-50 p-2 rounded border text-muted-foreground">N/A</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tỷ lệ</Label>
                      <p className="bg-gray-50 p-2 rounded border text-muted-foreground">N/A</p>
                    </div>
                  </div>
                )}
                
                {selectedItem.productDetail && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label>Nhà sản xuất</Label>
                      <p className="bg-gray-50 p-2 rounded border">
                        {selectedItem.productDetail.manufacturer || "N/A"}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Xuất xứ</Label>
                      <p className="bg-gray-50 p-2 rounded border">
                        {selectedItem.productDetail.origin || "N/A"}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Số lượng pack</Label>
                      <p className="bg-gray-50 p-2 rounded border">
                        {selectedItem.productDetail.quantityOfPack || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ảnh chi tiết */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ảnh chi tiết sản phẩm</h3>
                {selectedItem.productImages && selectedItem.productImages.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Có {selectedItem.productImages.length} ảnh chi tiết
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {selectedItem.productImages.map((image: ProductImage, index: number) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.productImg}
                            alt={`Product detail ${index + 1}`}
                            className="w-full h-24 object-cover rounded border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                              // Optional: Mở ảnh trong modal lớn hơn
                              window.open(image.productImg, '_blank')
                            }}
                          />
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">Chưa có ảnh chi tiết</p>
                  </div>
                )}
              </div>

              {/* Thông tin khác - Bỏ ngày cập nhật cuối */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin hệ thống</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>ID sản phẩm</Label>
                    <p className="text-muted-foreground font-mono text-sm bg-gray-50 p-2 rounded border">
                      {selectedItem.id}
                    </p>
                  </div>
                  {selectedItem.productDetail && (
                    <div className="grid gap-2">
                      <Label>ID thông tin kỹ thuật</Label>
                      <p className="text-muted-foreground font-mono text-sm bg-gray-50 p-2 rounded border">
                        {selectedItem.productDetail.id || "N/A"}
                      </p>
                    </div>
                  )}
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
              {renderChangeIndicator()}
              
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
                      value={editFormData.price || ""}
                      onChange={handlePriceChange}
                      placeholder="650000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-stock">Số lượng</Label>
                    <Input 
                      id="edit-product-stock" 
                      type="number" 
                      value={editFormData.stockQuantity || ""}
                      onChange={handleStockChange}
                      placeholder="25" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-product-status">Trạng thái</Label>
                    <Select 
                      value={editFormData.status || "active"}
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Còn hàng</SelectItem>
                        <SelectItem value="inactive">Hết hàng</SelectItem>
                        <SelectItem value="draft">Chuẩn bị nhập hàng</SelectItem>
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
                      value={editFormData.quantityOfPack || ""}
                      onChange={handleQuantityPackChange}
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
                            {loading ? "..." : "×"}
                          </Button>
                          <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 Bấm "×" để xóa ảnh ngay lập tức khỏi database.
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
                        Ảnh sẽ được lưu ngay lập tức khi bạn thêm
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
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Đang thêm...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-5 w-5" />
                          Thêm ảnh ngay
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Thông tin tổng kết */}
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        Ảnh hiện có: {editProductImages.length}
                      </span>
                    </div>
                    <span className="font-medium">
                      Tổng: {editProductImages.length} ảnh
                    </span>
                  </div>
                  {loading && (
                    <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                      <div className="w-3 h-3 border border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                {renderChangesCount()}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditProductOpen(false)
                  resetEditForm()
                }}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  onClick={handleUpdateProduct}
                  disabled={loading || !hasChanges()}
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
                </Button>
              </div>
            </div>
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
