const API_BASE_URL = 'http://localhost:8080'
export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface MainCategoryResponse {
  id: string;
  categoryName: string;
  categoryImg: string;
}

export interface MainCategory {
  id: string;
  categoryName: string;
  categoryImg: string;
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

const mapMainCategoryToCategory = (data: MainCategoryResponse): MainCategory => {
  return {
    id: data.id,
    categoryName: data.categoryName,
    categoryImg: data.categoryImg,
  };
};

// Tạo danh mục chính mới
export const createMainCategory = async (data: { categoryName: string; }, file?: File) => {
  const formData = new FormData();
  formData.append('categoryName', data.categoryName);
  if (file) formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/mainCategory/create`, {
    method: 'POST',
    body: formData,
  });
  const result = await handleResponse(response);
  return mapMainCategoryToCategory(result.result);
};

// Cập nhật danh mục chính
export const updateMainCategory = async (id: string, data: { categoryName: string; }, file?: File) => {
  const formData = new FormData();
  formData.append('categoryName', data.categoryName);
  if (file) formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/mainCategory/update/${id}`, {
    method: 'PUT',
    body: formData,
  });
  const result = await handleResponse(response);
  return mapMainCategoryToCategory(result.result);
};

// Lấy tất cả danh mục chính
export const getAllMainCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/mainCategory/getAll`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return result.result?.map(mapMainCategoryToCategory) || [];
};

// Lấy danh mục chính theo ID
export const getMainCategoryById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/mainCategory/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return mapMainCategoryToCategory(result.result);
};

// Xóa danh mục chính
export const deleteMainCategory = async (id: string) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/mainCategory/delete/${id}`, {
    method: 'DELETE',
  });
  const result = await handleResponse(response);
  return result;
};

