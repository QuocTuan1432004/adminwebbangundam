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

// Mock data
const parentCategories = [
  {
    id: 1,
    name: "Real Grade (RG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=RG",
    image: "/placeholder.svg?height=100&width=100&text=RG",
  },
  {
    id: 2,
    name: "Master Grade (MG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=MG",
    image: "/placeholder.svg?height=100&width=100&text=MG",
  },
  {
    id: 3,
    name: "Perfect Grade (PG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=PG",
    image: "/placeholder.svg?height=100&width=100&text=PG",
  },
  {
    id: 4,
    name: "High Grade (HG)",
    iconImage: "/placeholder.svg?height=50&width=50&text=HG",
    image: "/placeholder.svg?height=100&width=100&text=HG",
  },
]

const subCategories = [
  {
    id: 1,
    parentId: 1,
    parentName: "Real Grade (RG)",
    name: "RG Gundam",
    description: "Các mô hình Gundam dòng RG",
    image: "/placeholder.svg?height=100&width=100&text=RG-G",
  },
  {
    id: 2,
    parentId: 1,
    parentName: "Real Grade (RG)",
    name: "RG Zaku",
    description: "Các mô hình Zaku dòng RG",
    image: "/placeholder.svg?height=100&width=100&text=RG-Z",
  },
  {
    id: 3,
    parentId: 2,
    parentName: "Master Grade (MG)",
    name: "MG Gundam",
    description: "Các mô hình Gundam dòng MG",
    image: "/placeholder.svg?height=100&width=100&text=MG-G",
  },
  {
    id: 4,
    parentId: 2,
    parentName: "Master Grade (MG)",
    name: "MG Strike",
    description: "Các mô hình Strike dòng MG",
    image: "/placeholder.svg?height=100&width=100&text=MG-S",
  },
]

export function CategoriesPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h2>
          <p className="text-muted-foreground">Quản lý danh mục cha và danh mục con</p>
        </div>
        <div className="flex gap-2">
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
                  <Input id="parent-category-name" placeholder="VD: Real Grade (RG)" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent-category-icon">Icon danh mục</Label>
                  <Input id="parent-category-icon" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">Chọn icon nhỏ cho danh mục (khuyến nghị 50x50px)</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm danh mục cha</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddSubCategoryOpen} onOpenChange={setIsAddSubCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCategoryType("sub")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục con
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục con mới</DialogTitle>
                <DialogDescription>Tạo danh mục con thuộc danh mục cha</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent-select">Danh mục cha</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id.toString()}>
                          {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-name">Tên danh mục con</Label>
                  <Input id="sub-category-name" placeholder="VD: RG Gundam" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-description">Mô tả</Label>
                  <Textarea id="sub-category-description" placeholder="Mô tả danh mục con" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub-category-image">Hình ảnh danh mục</Label>
                  <Input id="sub-category-image" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">Chọn hình ảnh đại diện cho danh mục con</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSubCategoryOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm danh mục con</Button>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên danh mục</TableHead>
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
                        src={category.iconImage || "/placeholder.svg"}
                        alt={`${category.name} icon`}
                        className="w-8 h-8 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{subCategories.filter((sub) => sub.parentId === category.id).length}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 50) + 10}</TableCell>
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
                        src={subCategory.image || "/placeholder.svg"}
                        alt={subCategory.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{subCategory.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            parentCategories.find((p) => p.id === subCategory.parentId)?.iconImage || "/placeholder.svg"
                          }
                          alt="Parent icon"
                          className="w-6 h-6 rounded object-cover"
                        />
                        <Badge variant="outline">{subCategory.parentName}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{subCategory.description}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 20) + 1}</TableCell>
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
          </CardContent>
        </Card>
      )}

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết {selectedItem?.parentName ? "danh mục con" : "danh mục cha"}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tên:</Label>
                <p className="font-medium">{selectedItem.name}</p>
              </div>
              {selectedItem.parentName && (
                <div className="grid gap-2">
                  <Label>Danh mục cha:</Label>
                  <Badge variant="outline">{selectedItem.parentName}</Badge>
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
              Bạn có chắc chắn muốn xóa {deleteType} "{itemToDelete?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log(`Xóa ${deleteType}:`, itemToDelete)
                setIsDeleteConfirmOpen(false)
                setItemToDelete(null)
                setDeleteType("")
              }}
            >
              Xóa
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
                  defaultValue={selectedItem.name}
                  placeholder="VD: Real Grade (RG)"
                />
              </div>
              <div className="grid gap-2">
                <Label>Icon danh mục hiện tại</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedItem.iconImage || "/placeholder.svg"}
                    alt="Current icon"
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <Input type="file" accept="image/*" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Chọn icon mới (khuyến nghị 50x50px) hoặc để trống để giữ icon hiện tại
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Hình ảnh danh mục hiện tại</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt="Current image"
                    className="w-20 h-20 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <Input type="file" accept="image/*" />
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
              onClick={() => {
                console.log("Cập nhật danh mục cha:", selectedItem)
                setIsEditCategoryOpen(false)
                setSelectedItem(null)
              }}
            >
              Cập nhật
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
                <Select defaultValue={selectedItem.parentId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id.toString()}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sub-category-name">Tên danh mục con</Label>
                <Input id="edit-sub-category-name" defaultValue={selectedItem.name} placeholder="VD: RG Gundam" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sub-category-description">Mô tả</Label>
                <Textarea
                  id="edit-sub-category-description"
                  defaultValue={selectedItem.description}
                  placeholder="Mô tả danh mục con"
                />
              </div>
              <div className="grid gap-2">
                <Label>Hình ảnh danh mục hiện tại</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt="Current image"
                    className="w-20 h-20 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <Input type="file" accept="image/*" />
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
              onClick={() => {
                console.log("Cập nhật danh mục con:", selectedItem)
                setIsEditSubCategoryOpen(false)
                setSelectedItem(null)
              }}
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
