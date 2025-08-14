const API_BASE_URL = 'http://localhost:8080'

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface ProductDetailResponse {
  id: string;
  manufacturer: string;
  material: string;
  ratio: string;
  origin: string;
  quantityOfPack: number;
  height: string;
  productId: string;
}

export interface ProductDetail {
  id: string;
  manufacturer: string;
  material: string;
  ratio: string;
  origin: string;
  quantityOfPack: number;
  height: string;
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

const mapProductDetailResponseToProductDetail = (data: ProductDetailResponse): ProductDetail => {
  return {
    id: data.id,
    manufacturer: data.manufacturer,
    material: data.material,
    ratio: data.ratio,
    origin: data.origin,
    quantityOfPack: data.quantityOfPack,
    height: data.height,
    productId: data.productId,
  };
};

// Tạo chi tiết sản phẩm mới
export const createProductDetail = async (
  productId: string,
  data: {
    manufacturer: string;
    material: string;
    ratio: string;
    origin: string;
    quantityOfPack: number;
    height: string;
  }
) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/productDetail/create/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return mapProductDetailResponseToProductDetail(result.result);
};

// Cập nhật chi tiết sản phẩm
export const updateProductDetail = async (
  productDetailId: string,
  data: {
    manufacturer: string;
    material: string;
    ratio: string;
    origin: string;
    quantityOfPack: number;
    height: string;
  }
) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/productDetail/update/${productDetailId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return mapProductDetailResponseToProductDetail(result.result);
};

// Lấy chi tiết sản phẩm theo ID
export const getProductDetail = async (productDetailId: string) => {
  const response = await fetch(`${API_BASE_URL}/productDetail/get/${productDetailId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return mapProductDetailResponseToProductDetail(result.result);
};

// Xóa chi tiết sản phẩm
export const deleteProductDetail = async (productDetailId: string) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/productDetail/delete/${productDetailId}`, {
    method: 'DELETE',
  });
  const result = await handleResponse(response);
  return result;
};