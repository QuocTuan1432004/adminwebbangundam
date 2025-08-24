const API_BASE_URL = 'http://localhost:8080'

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface MainCategoryInfo {
  id: string;
  categoryName: string;
  categoryImg: string;
}

export interface SubCategoryInfo {
  id: string;
  subCategoryName: string;
  subCategoryImg: string;
  description: string;
  mainCategory: MainCategoryInfo;
}

export interface ProductResponse {
  id: string;
  productName: string;
  price: number;
  description: string;
  status: string;
  stockQuantity: number;
  thumbnail: string;
  subcategory: SubCategoryInfo;
  createdAt?: string;
}

export interface Product {
  id: string;
  productName: string;
  price: number;
  description: string;
  subCategoryId?: string;
  status: string;
  stockQuantity: number;
  thumbnail: string;
  subcategory?: SubCategoryInfo;
  createdAt?: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
};

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token');
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

const mapProductResponseToProduct = (data: ProductResponse): Product => {
  return {
    id: data.id,
    productName: data.productName,
    price: data.price,
    description: data.description,
    subCategoryId: data.subcategory?.id,
    status: data.status,
    stockQuantity: data.stockQuantity,
    thumbnail: data.thumbnail,
    subcategory: data.subcategory,
    createdAt: data.createdAt,
  };
};

// Tạo sản phẩm mới
export const createProduct = async (
  subCategoryId: string,
  data: {
    productName: string;
    price: number;
    description: string;
    stockQuantity: number;
    status: string;
  },
  file: File
) => {
  const formData = new FormData();
  formData.append('productName', data.productName);
  formData.append('price', data.price.toString());
  formData.append('description', data.description);
  formData.append('stockQuantity', data.stockQuantity.toString());
  formData.append('status', data.status);
  formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/product/create/${subCategoryId}`, {
    method: 'POST',
    body: formData,
  });
  const result = await handleResponse(response);
  return mapProductResponseToProduct(result.result);
};

// Cập nhật sản phẩm
export const updateProduct = async (
  productId: string,
  data: {
    productName: string;
    price: number;
    description: string;
    status: string;
    subCategoryId: string;
    stockQuantity: number;
  },
  file?: File
) => {
  const formData = new FormData();
  formData.append('productName', data.productName != null ? data.productName : '');
  formData.append('price', data.price != null ? data.price.toString() : '');
  formData.append('description', data.description != null ? data.description : '');
  formData.append('status', data.status != null ? data.status : '');
  formData.append('subCategoryId', data.subCategoryId != null ? data.subCategoryId : '');
  formData.append('stockQuantity', data.stockQuantity != null ? data.stockQuantity.toString() : '');
  if (file) formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/product/update/${productId}`, {
    method: 'PUT',
    body: formData,
  });
  const result = await handleResponse(response);
  return mapProductResponseToProduct(result.result);
};

// Lấy sản phẩm theo subcategory
export const getProductsBySubCategory = async (subCategoryId: string) => {
  const response = await fetch(`${API_BASE_URL}/product/getProduct/${subCategoryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return result.result?.map(mapProductResponseToProduct) || [];
};

export const getAllProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/product/getAll`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return result.result?.map(mapProductResponseToProduct) || [];
};

// Xóa sản phẩm
export const deleteProduct = async (productId: string) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/product/delete/${productId}`, {
    method: 'DELETE',
  });
  const result = await handleResponse(response);
  return result;
};

// Lấy tổng số sản phẩm
export const getProductCount = async (): Promise<number> => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/product/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await handleResponse(response);
    return result.result || 0;
  } catch (error) {
    console.error('Error getting product count:', error);
    throw error;
  }
};

export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/product/getByProductId/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await handleResponse(response);
    // Backend trả về ProductResponse trong result
    return result.result;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};

// ✅ THÊM: Lấy nhiều sản phẩm song song với error handling
export const getProductsByIds = async (productIds: string[]): Promise<{ [key: string]: Product }> => {
  try {
    if (productIds.length === 0) return {};

    // Load song song tất cả products
    const promises = productIds.map(async (id) => {
      try {
        const product = await getProductById(id);
        return { id, product };
      } catch (error) {
        console.warn(`⚠️ Failed to load product ${id}:`, error);
        return { id, product: null };
      }
    });
    
    const results = await Promise.allSettled(promises);
    
    // Tạo map từ results
    const productsMap: { [key: string]: Product } = {};
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.product) {
        productsMap[result.value.id] = result.value.product;
      }
    });
    
    return productsMap;
  } catch (error) {
    console.error('❌ Error getting products by IDs:', error);
    return {};
  }
};

// ✅ THÊM: Lấy top 5 sản phẩm bán chạy nhất (lowest stock)
export const getTop5BestSellerProducts = async (): Promise<Product[]> => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/product/getTop5BestSeller`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await handleResponse(response);
    
    if (result.result && Array.isArray(result.result)) {
      const products = result.result.map(mapProductResponseToProduct);
      return products;
    }
    
    console.warn('⚠️ No best seller products found');
    return [];
  } catch (error) {
    console.error('❌ Error getting top 5 best seller products:', error);
    throw error;
  }
};