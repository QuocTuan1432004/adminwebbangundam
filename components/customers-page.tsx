"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { userApi } from "@/hooks/user/userApi"
import { AdminAuthService } from "@/hooks/user/userAuth"

interface Customer {
  id: string;
  username?: string;
  email: string;
  fullName?: string;
  phoneNumber?: number;
  gender?: string;
  createdAt?: string;
  roles: string[];
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Load all customers from API
  const loadAllCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = AdminAuthService.getToken();
      if (!token) {
        setError("No authentication token");
        return;
      }

      const response = await userApi.getAllUsers(token);
      
      if (response.result) {
        // Filter out any invalid users and ensure required fields exist
        const validUsers = response.result.filter((user, index) => {
          // Ensure user has valid id and email
          const isValid = user && 
            user.id && 
            typeof user.id === 'string' &&
            user.email && 
            typeof user.email === 'string';
          
          if (!isValid) {
            console.warn(`Invalid user at index ${index}:`, user);
          }
          
          return isValid;
        });
        
        // Remove duplicates by id
        const uniqueUsers = validUsers.filter((user, index, self) => 
          index === self.findIndex(u => u.id === user.id)
        );
        
        setCustomers(uniqueUsers);
      } else {
        setError("Không thể tải danh sách khách hàng");
      }
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("Lỗi khi tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  // Search customers by keyword using API
  const searchCustomers = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      await loadAllCustomers();
      return;
    }

    try {
      setSearching(true);
      setError("");
      
      const token = AdminAuthService.getToken();
      if (!token) {
        setError("No authentication token");
        return;
      }

      const response = await userApi.searchUsers(token, keyword);
      
      if (response.result) {
        // Convert EmailResponse to Customer interface with safety checks
        const searchResults = response.result
          .map((user, index) => ({
            id: user.id || `search-${index}-${Date.now()}`, // Fallback unique id
            username: user.username,
            email: user.email || "",
            fullName: user.fullName,
            gender: user.gender,
            createdAt: user.createdAt,
            roles: user.roles || []
          }))
          .filter(user => user.id && user.email); // Only keep valid users
        
        // Remove duplicates by id
        const uniqueResults = searchResults.filter((user, index, self) => 
          index === self.findIndex(u => u.id === user.id)
        );
        
        setCustomers(uniqueResults);
      } else {
        setError("Không thể tìm kiếm khách hàng");
      }
    } catch (err) {
      console.error("Error searching customers:", err);
      setError("Lỗi khi tìm kiếm khách hàng");
    } finally {
      setSearching(false);
    }
  }, [loadAllCustomers]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCustomers(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchCustomers]);

  // Initial load
  useEffect(() => {
    loadAllCustomers();
  }, [loadAllCustomers]);

  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return "N/A";
    }
  }, []);

  // Safe function to get first character for avatar
  const getAvatarText = useCallback((customer: Customer) => {
    if (customer.username && customer.username.length > 0) {
      return customer.username[0].toUpperCase();
    }
    if (customer.email && customer.email.length > 0) {
      return customer.email[0].toUpperCase();
    }
    return "U";
  }, []);

  const isLoadingOrSearching = loading || searching;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
        <p className="text-muted-foreground">Thông tin và danh sách khách hàng</p>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searching && (
            <div className="absolute right-2 top-2.5">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        {searchTerm && (
          <Button 
            variant="outline" 
            onClick={() => setSearchTerm("")}
          >
            Xóa tìm kiếm
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>
            {searchTerm 
              ? `Kết quả tìm kiếm cho "${searchTerm}": ${customers.length} khách hàng`
              : `Hiển thị ${customers.length} khách hàng`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingOrSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">
                {searching ? "Đang tìm kiếm..." : "Đang tải danh sách khách hàng..."}
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? "Không tìm thấy khách hàng" : "Chưa có khách hàng nào"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, index) => {
                    // Double safety check for unique key
                    const uniqueKey = customer.id || `customer-${index}-${customer.email}`;
                    
                    return (
                      <TableRow key={uniqueKey}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={`/placeholder.svg?height=32&width=32&text=${getAvatarText(customer)}`}
                              />
                              <AvatarFallback>
                                {getAvatarText(customer)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {customer.username || "Chưa có username"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.email || "N/A"}</TableCell>
                        <TableCell>{customer.gender || "N/A"}</TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}