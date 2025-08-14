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
  formData.append('productName', data.productName);
  formData.append('price', data.price.toString());
  formData.append('description', data.description);
  formData.append('status', data.status);
  formData.append('subCategoryId', data.subCategoryId);
  formData.append('stockQuantity', data.stockQuantity.toString());
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