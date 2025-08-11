"use client"
import { Trash2, Edit, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BulkActionsProps {
  selectedItems: any[]
  onSelectAll: (checked: boolean) => void
  onSelectItem: (item: any, checked: boolean) => void
  onBulkDelete: () => void
  onBulkEdit?: () => void
  onBulkExport?: () => void
  totalItems: number
}

export function BulkActions({
  selectedItems,
  onSelectAll,
  onSelectItem,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
  totalItems,
}: BulkActionsProps) {
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < totalItems

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Checkbox
        checked={isAllSelected}
        ref={(el) => {
          if (el) el.indeterminate = isIndeterminate
        }}
        onCheckedChange={(checked) => onSelectAll(!!checked)}
      />

      {selectedItems.length > 0 && (
        <>
          <span className="text-sm text-muted-foreground">Đã chọn {selectedItems.length} mục</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Thao tác hàng loạt
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {onBulkEdit && (
                <DropdownMenuItem onClick={onBulkEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {onBulkExport && (
                <DropdownMenuItem onClick={onBulkExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất dữ liệu
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onBulkDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tất cả
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}
