"use client"

import * as React from "react"
import { Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

// Import API functions
import { 
  getAllMainCategories, 
  createMainCategory, 
  updateMainCategory, 
  deleteMainCategory,
  MainCategory 
} from "@/hooks/category/MainCategory"

import {
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  SubCategory
} from "@/hooks/category/SubCategory"

export function CategoriesPage() {
  // States
  const [isAddCategoryOpen, setIsAddCategoryOpen] = React.useState(false)
  const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = React.useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = React.useState(false)
  const [isEditSubCategoryOpen, setIsEditSubCategoryOpen] = React.useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [categoryType, setCategoryType] = React.useState<"parent" | "sub">("parent")
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [deleteType, setDeleteType] = React.useState<string>("")
  const [itemToDelete, setItemToDelete] = React.useState<any>(null)
  
  // API data states
  const [parentCategories, setParentCategories] = React.useState<MainCategory[]>([])
  const [subCategories, setSubCategories] = React.useState<SubCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Form states cho danh mục cha
  const [categoryName, setCategoryName] = React.useState("")
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [editCategoryName, setEditCategoryName] = React.useState("")
  const [editSelectedFile, setEditSelectedFile] = React.useState<File | null>(null)

  // Form states cho danh mục con
  const [subCategoryName, setSubCategoryName] = React.useState("")
  const [subCategoryDescription, setSubCategoryDescription] = React.useState("")
  const [selectedMainCategoryId, setSelectedMainCategoryId] = React.useState("")
  const [subSelectedFile, setSubSelectedFile] = React.useState<File | null>(null)
  const [editSubCategoryName, setEditSubCategoryName] = React.useState("")
  const [editSubCategoryDescription, setEditSubCategoryDescription] = React.useState("")
  const [editSelectedMainCategoryId, setEditSelectedMainCategoryId] = React.useState("")
  const [editSubSelectedFile, setEditSubSelectedFile] = React.useState<File | null>(null)

  // Thêm states cho preview ảnh
  const [categoryImagePreview, setCategoryImagePreview] = React.useState<string | null>(null)
  const [subCategoryImagePreview, setSubCategoryImagePreview] = React.useState<string | null>(null)

  // Load data khi component mount
  React.useEffect(() => {
    loadMainCategories()
    loadSubCategories()
  }, [])

  // API Functions cho Main Category
  const loadMainCategories = async () => {
    try {
      setIsLoading(true)
      const categories = await getAllMainCategories()
      setParentCategories(categories)
    } catch (error) {
      console.error('Error loading main categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // API Functions cho Sub Category
  const loadSubCategories = async () => {
    try {
      setIsLoading(true)
      const categories = await getAllSubCategories()
      setSubCategories(categories)
    } catch (error) {
      console.error('Error loading sub categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      console.log("Lỗi: Vui lòng nhập tên danh mục")
      return
    }

    try {
      setIsLoading(true)
      await createMainCategory({ categoryName }, selectedFile || undefined)
      
      console.log("Tạo danh mục cha thành công")
      
      // Reset form và preview
      resetCategoryForm()
      await loadMainCategories()
    } catch (error) {
      console.error('Error creating main category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSubCategory = async () => {
    if (!subCategoryName.trim() || !subCategoryDescription.trim() || !selectedMainCategoryId || !subSelectedFile) {
      console.log("Lỗi: Vui lòng điền đầy đủ thông tin và chọn hình ảnh")
      return
    }

    try {
      setIsLoading(true)
      await createSubCategory(
        selectedMainCategoryId,
        { 
          subCategoryName: subCategoryName, 
          description: subCategoryDescription 
        },
        subSelectedFile
      )
      
      console.log("Tạo danh mục con thành công")
      
      // Reset form và preview
      resetSubCategoryForm()
      await loadSubCategories()
    } catch (error) {
      console.error('Error creating sub category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!selectedItem || !editCategoryName.trim()) {
      console.log("Lỗi: Vui lòng nhập tên danh mục")
      return
    }

    try {
      setIsLoading(true)
      await updateMainCategory(
        selectedItem.id, 
        { categoryName: editCategoryName }, 
        editSelectedFile || undefined
      )
      
      console.log("Cập nhật danh mục cha thành công")
      
      // Reset form và reload data
      setEditCategoryName("")
      setEditSelectedFile(null)
      setIsEditCategoryOpen(false)
      setSelectedItem(null)
      await loadMainCategories()
    } catch (error) {
      console.error('Error updating main category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSubCategory = async () => {
    if (!selectedItem || !editSubCategoryName.trim() || !editSubCategoryDescription.trim() || !editSelectedMainCategoryId) {
      console.log("Lỗi: Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      setIsLoading(true)
      await updateSubCategory(
        selectedItem.id,
        {
          subCategoryName: editSubCategoryName,
          description: editSubCategoryDescription,
          mainCategoryId: editSelectedMainCategoryId
        },
        editSubSelectedFile || undefined
      )
      
      console.log("Cập nhật danh mục con thành công")
      
      // Reset form và reload data
      setEditSubCategoryName("")
      setEditSubCategoryDescription("")
      setEditSelectedMainCategoryId("")
      setEditSubSelectedFile(null)
      setIsEditSubCategoryOpen(false)
      setSelectedItem(null)
      await loadSubCategories()
    } catch (error) {
      console.error('Error updating sub category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!itemToDelete) return

    try {
      setIsLoading(true)
      
      if (deleteType === "danh mục cha") {
        await deleteMainCategory(itemToDelete.id)
        await loadMainCategories()
      } else {
        await deleteSubCategory(itemToDelete.id)
        await loadSubCategories()
      }
      
      console.log(`Xóa ${deleteType} thành công`)
      
      // Reset states
      setIsDeleteConfirmOpen(false)
      setItemToDelete(null)
      setDeleteType("")
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function để lấy tên danh mục cha từ SubCategory object
  const getMainCategoryNameFromSub = (subCategory: SubCategory) => {
    return subCategory.mainCategory ? subCategory.mainCategory.categoryName : "Unknown"
  }

  // Helper function để lấy tên danh mục cha từ ID (cho edit operations)
  const getMainCategoryName = (mainCategoryId: string) => {
    const mainCategory = parentCategories.find(cat => cat.id === mainCategoryId)
    return mainCategory ? mainCategory.categoryName : "Unknown"
  }

  // Helper function để tạo preview ảnh
  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // Cleanup preview URLs khi component unmount
  React.useEffect(() => {
    return () => {
      if (categoryImagePreview) URL.revokeObjectURL(categoryImagePreview)
      if (subCategoryImagePreview) URL.revokeObjectURL(subCategoryImagePreview)
    }
  }, [])

  // Xử lý chọn file cho danh mục cha
  const handleCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    
    // Cleanup preview cũ
    if (categoryImagePreview) {
      URL.revokeObjectURL(categoryImagePreview)
    }
    
    // Tạo preview mới
    if (file) {
      const previewUrl = createImagePreview(file)
      setCategoryImagePreview(previewUrl)
    } else {
      setCategoryImagePreview(null)
    }
  }

  // Xử lý chọn file cho danh mục con
  const handleSubCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSubSelectedFile(file)
    
    // Cleanup preview cũ
    if (subCategoryImagePreview) {
      URL.revokeObjectURL(subCategoryImagePreview)
    }
    
    // Tạo preview mới
    if (file) {
      const previewUrl = createImagePreview(file)
      setSubCategoryImagePreview(previewUrl)
    } else {
      setSubCategoryImagePreview(null)
    }
  }

  // Reset preview khi đóng dialog
  const resetCategoryForm = () => {
    setCategoryName("")
    setSelectedFile(null)
    if (categoryImagePreview) {
      URL.revokeObjectURL(categoryImagePreview)
      setCategoryImagePreview(null)
    }
    setIsAddCategoryOpen(false)
  }

  const resetSubCategoryForm = () => {
    setSubCategoryName("")
    setSubCategoryDescription("")
    setSelectedMainCategoryId("")
    setSubSelectedFile(null)
    if (subCategoryImagePreview) {
      URL.revokeObjectURL(subCategoryImagePreview)
      setSubCategoryImagePreview(null)
    }
    setIsAddSubCategoryOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h2>
          <p className="text-muted-foreground">Quản lý danh mục cha và danh mục con</p>
        </div>
        <div className="flex gap-2">
          {/* Dialog thêm danh mục cha với preview ảnh */}
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCategoryType("parent")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục cha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục cha mới</DialogTitle>
                <DialogDescription>Tạo danh mục cha mới cho sản phẩm</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent-category-name">Tên danh mục cha</Label>
                  <Input 
                    id="parent-category-name" 
                    placeholder="VD: Real Grade (RG)" 
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent-category-image">Hình ảnh danh mục</Label>
                  <Input 
                    id="parent-category-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCategoryFileChange}
                  />
                  <p className="text-sm text-muted-foreground">Chọn hình ảnh cho danh mục</p>
                  
                  {/* Preview ảnh danh mục cha */}
                  {categoryImagePreview && (
                    <div className="mt-2">
                      <Label>Xem trước:</Label>
                      <div className="mt-1 flex justify-center">
                        <img
                          src={categoryImagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded border-2 border-dashed border-gray-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetCategoryForm}>
                  Hủy
                </Button>
                <Button type="submit" onClick={handleCreateCategory} disabled={isLoading}>
                  {isLoading ? "Đang tạo..." : "Thêm danh mục cha"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog thêm danh mục con với preview ảnh */}
          <Dialog open={isAddSubCategoryOpen} onOpenChange={setIsAddSubCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCategoryType("sub")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục con
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm danh mục con mới</DialogTitle>
                <DialogDescription>Tạo danh mục con thuộc danh mục cha</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent-select">Danh mục cha</Label>
                  <Select value={selectedMainCategoryId} onValueChange={setSelectedMainCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-name">Tên danh mục con</Label>
                  <Input 
                    id="sub-category-name" 
                    placeholder="VD: RG Gundam" 
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-description">Mô tả</Label>
                  <Textarea 
                    id="sub-category-description" 
                    placeholder="Mô tả danh mục con" 
                    value={subCategoryDescription}
                    onChange={(e) => setSubCategoryDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-image">Hình ảnh danh mục</Label>
                  <Input 
                    id="sub-category-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleSubCategoryFileChange}
                  />
                  <p className="text-sm text-muted-foreground">Chọn hình ảnh đại diện cho danh mục con</p>
                  
                  {/* Preview ảnh danh mục con */}
                  {subCategoryImagePreview && (
                    <div className="mt-2">
                      <Label>Xem trước:</Label>
                      <div className="mt-1 flex justify-center">
                        <img
                          src={subCategoryImagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded border-2 border-dashed border-gray-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetSubCategoryForm}>
                  Hủy
                </Button>
                <Button type="submit" onClick={handleCreateSubCategory} disabled={isLoading}>
                  {isLoading ? "Đang tạo..." : "Thêm danh mục con"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs để chuyển đổi giữa danh mục cha và con */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        <Button
          variant={categoryType === "parent" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCategoryType("parent")}
          className="flex-1"
        >
          Danh mục cha
        </Button>
        <Button
          variant={categoryType === "sub" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCategoryType("sub")}
          className="flex-1"
        >
          Danh mục con
        </Button>
      </div>

      {/* Hiển thị danh mục cha */}
      {categoryType === "parent" && (
        <Card>
          <CardHeader>
            <CardTitle>Danh mục cha</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="text-muted-foreground">Đang tải danh mục...</div>
              </div>
            ) : parentCategories.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-muted-foreground">Chưa có danh mục nào</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Số danh mục con</TableHead>
                    <TableHead>Số sản phẩm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parentCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <img
                          src={category.categoryImg || "/placeholder.svg"}
                          alt={category.categoryName}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{category.categoryName}</TableCell>
                      <TableCell className="text-muted-foreground">{category.id}</TableCell>
                      <TableCell>
                        {subCategories.filter((sub) => sub.mainCategoryId === category.id).length}
                      </TableCell>
                      <TableCell>0</TableCell>
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
                                setSelectedItem(category)
                                setIsViewDetailsOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedItem(category)
                                setEditCategoryName(category.categoryName)
                                setIsEditCategoryOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setItemToDelete(category)
                                setDeleteType("danh mục cha")
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Hiển thị danh mục con */}
      {categoryType === "sub" && (
        <Card>
          <CardHeader>
            <CardTitle>Danh mục con</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="text-muted-foreground">Đang tải danh mục con...</div>
              </div>
            ) : subCategories.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-muted-foreground">Chưa có danh mục con nào</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên danh mục con</TableHead>
                    <TableHead>Danh mục cha</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Số sản phẩm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subCategories.map((subCategory) => (
                    <TableRow key={subCategory.id}>
                      <TableCell>
                        <img
                          src={subCategory.subCategoryImg || "/placeholder.svg"}
                          alt={subCategory.subCategoryName}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{subCategory.subCategoryName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getMainCategoryNameFromSub(subCategory)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{subCategory.description}</TableCell>
                      <TableCell>0</TableCell>
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
                                setSelectedItem(subCategory)
                                setIsViewDetailsOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedItem(subCategory)
                                setEditSubCategoryName(subCategory.subCategoryName)
                                setEditSubCategoryDescription(subCategory.description)
                                setEditSelectedMainCategoryId(subCategory.mainCategoryId)
                                setIsEditSubCategoryOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setItemToDelete(subCategory)
                                setDeleteType("danh mục con")
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết {selectedItem?.mainCategoryId ? "danh mục con" : "danh mục cha"}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tên:</Label>
                <p className="font-medium">{selectedItem.categoryName || selectedItem.subCategoryName}</p>
              </div>
              {selectedItem.mainCategoryId && (
                <div className="grid gap-2">
                  <Label>Danh mục cha:</Label>
                  <Badge variant="outline">{selectedItem.mainCategory.categoryName}</Badge>
                </div>
              )}
              {selectedItem.description && (
                <div className="grid gap-2">
                  <Label>Mô tả:</Label>
                  <p>{selectedItem.description}</p>
                </div>
              )}
              <div className="grid gap-2">
                <Label>ID:</Label>
                <p className="text-muted-foreground">{selectedItem.id}</p>
              </div>
              {(selectedItem.categoryImg || selectedItem.subCategoryImg) && (
                <div className="grid gap-2">
                  <Label>Hình ảnh:</Label>
                  <img
                    src={selectedItem.categoryImg || selectedItem.subCategoryImg}
                    alt={selectedItem.categoryName || selectedItem.subCategoryName}
                    className="w-32 h-32 rounded object-cover border"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa {deleteType} "{itemToDelete?.categoryName || itemToDelete?.subCategoryName}"? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isLoading}
            >
              {isLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa danh mục cha */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục cha</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục cha</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-parent-category-name">Tên danh mục cha</Label>
                <Input
                  id="edit-parent-category-name"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  placeholder="VD: Real Grade (RG)"
                />
              </div>
              <div className="grid gap-2">
                <Label>Hình ảnh danh mục hiện tại</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedItem.categoryImg || "/placeholder.svg"}
                    alt="Current image"
                    className="w-20 h-20 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setEditSelectedFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Chọn hình ảnh mới hoặc để trống để giữ hình ảnh hiện tại
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateCategory}
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa danh mục con */}
      <Dialog open={isEditSubCategoryOpen} onOpenChange={setIsEditSubCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục con</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục con</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-parent-select">Danh mục cha</Label>
                <Select value={editSelectedMainCategoryId} onValueChange={setEditSelectedMainCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sub-category-name">Tên danh mục con</Label>
                <Input 
                  id="edit-sub-category-name" 
                  value={editSubCategoryName}
                  onChange={(e) => setEditSubCategoryName(e.target.value)}
                  placeholder="VD: RG Gundam" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sub-category-description">Mô tả</Label>
                <Textarea
                  id="edit-sub-category-description"
                  value={editSubCategoryDescription}
                  onChange={(e) => setEditSubCategoryDescription(e.target.value)}
                  placeholder="Mô tả danh mục con"
                />
              </div>
              <div className="grid gap-2">
                <Label>Hình ảnh danh mục hiện tại</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedItem.subCategoryImg || "/placeholder.svg"}
                    alt="Current image"
                    className="w-20 h-20 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setEditSubSelectedFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Chọn hình ảnh mới hoặc để trống để giữ hình ảnh hiện tại
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSubCategoryOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateSubCategory}
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
