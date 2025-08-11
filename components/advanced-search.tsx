"use client"

import * as React from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface SearchFilter {
  key: string
  label: string
  type: "text" | "select" | "date" | "number"
  options?: { value: string; label: string }[]
}

interface AdvancedSearchProps {
  filters: SearchFilter[]
  onSearch: (filters: Record<string, any>) => void
  onClear: () => void
}

export function AdvancedSearch({ filters, onSearch, onClear }: AdvancedSearchProps) {
  const [searchValues, setSearchValues] = React.useState<Record<string, any>>({})
  const [isOpen, setIsOpen] = React.useState(false)

  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...searchValues, [key]: value }
    setSearchValues(newValues)
  }

  const handleSearch = () => {
    onSearch(searchValues)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSearchValues({})
    onClear()
    setIsOpen(false)
  }

  const activeFiltersCount = Object.values(searchValues).filter(Boolean).length

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm..."
          className="pl-8"
          value={searchValues.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Bộ lọc nâng cao</h4>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label>{filter.label}</Label>
                {filter.type === "select" && filter.options ? (
                  <Select
                    value={searchValues[filter.key] || ""}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Chọn ${filter.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : filter.type === "date" ? (
                  <Input
                    type="date"
                    value={searchValues[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                ) : filter.type === "number" ? (
                  <Input
                    type="number"
                    placeholder={`Nhập ${filter.label.toLowerCase()}`}
                    value={searchValues[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                ) : (
                  <Input
                    placeholder={`Nhập ${filter.label.toLowerCase()}`}
                    value={searchValues[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSearch} className="flex-1">
                Áp dụng
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
