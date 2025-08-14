const API_BASE_URL = 'http://localhost:8080'

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface ProductImgResponse {
  id: string;
  productImg: string;
  productId: string;
}

export interface ProductImage {
  id: string;
  productImg: string;
  productId: string;
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

const mapProductImgResponseToProductImage = (data: ProductImgResponse): ProductImage => {
  return {
    id: data.id,
    productImg: data.productImg,
    productId: data.productId,
  };
};

// Tạo ảnh sản phẩm mới
export const createProductImage = async (productId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/productImg/create/${productId}`, {
    method: 'POST',
    body: formData,
  });
  const result = await handleResponse(response);
  return mapProductImgResponseToProductImage(result.result);
};

// Cập nhật ảnh sản phẩm
export const updateProductImage = async (productImgId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/productImg/update/${productImgId}`, {
    method: 'PUT',
    body: formData,
  });
  const result = await handleResponse(response);
  return mapProductImgResponseToProductImage(result.result);
};

// Lấy tất cả ảnh của sản phẩm
export const getAllProductImages = async (productId: string) => {
  const response = await fetch(`${API_BASE_URL}/productImg/getAllImg/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return result.result?.map(mapProductImgResponseToProductImage) || [];
};

// Xóa ảnh sản phẩm
export const deleteProductImage = async (productImgId: string) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/productImg/delete/${productImgId}`, {
    method: 'DELETE',
  });
  const result = await handleResponse(response);
  return result;
};