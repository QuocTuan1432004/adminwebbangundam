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

export interface SubCategoryResponse {
  id: string;
  subCategoryName: string;
  subCategoryImg: string;
  description: string;
  mainCategory: MainCategoryInfo;
}

export interface SubCategory {
  id: string;
  subCategoryName: string;
  subCategoryImg: string;
  description: string;
  mainCategory: MainCategoryInfo;
  mainCategoryId: string; // Thêm field này để tương thích với code cũ
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

const mapSubCategoryToCategory = (data: SubCategoryResponse): SubCategory => {
  return {
    id: data.id,
    subCategoryName: data.subCategoryName,
    subCategoryImg: data.subCategoryImg,
    description: data.description,
    mainCategory: data.mainCategory || { id: '', categoryName: '', categoryImg: '' }, // Fallback
    mainCategoryId: data.mainCategory?.id || '', // Safe access với optional chaining
  };
};

// Tạo danh mục con mới
export const createSubCategory = async (
  mainCategoryId: string, 
  data: { subCategoryName: string; description: string }, 
  file: File
) => {
  const formData = new FormData();
  formData.append('subCategoryName', data.subCategoryName);
  formData.append('description', data.description);
  formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/subCategory/create/${mainCategoryId}`, {
    method: 'POST',
    body: formData,
  });
  const result = await handleResponse(response);
  return mapSubCategoryToCategory(result.result);
};

// Cập nhật danh mục con
export const updateSubCategory = async (
  subCategoryId: string, 
  data: { 
    subCategoryName: string; 
    description: string; 
    mainCategoryId: string 
  }, 
  file?: File
) => {
  const formData = new FormData();
  formData.append('subCategoryName', data.subCategoryName);
  formData.append('description', data.description);
  formData.append('mainCategoryId', data.mainCategoryId);
  if (file) formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/subCategory/update/${subCategoryId}`, {
    method: 'PUT',
    body: formData,
  });
  
  const result = await handleResponse(response);
  
  // Log để debug
  console.log('Update SubCategory API Response:', result);
  
  // Kiểm tra nếu result.result tồn tại
  if (!result.result) {
    console.warn('No result data returned from update API');
    // Có thể return một object mặc định hoặc throw error
    throw new Error('No data returned from update operation');
  }
  
  return mapSubCategoryToCategory(result.result);
};

// Lấy tất cả danh mục con theo danh mục cha
export const getSubCategoriesByMainCategory = async (mainCategoryId: string) => {
  const response = await fetch(`${API_BASE_URL}/subCategory/getAllByCategory/${mainCategoryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return result.result?.map(mapSubCategoryToCategory) || [];
};

// Lấy tất cả danh mục con
export const getAllSubCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/subCategory/getAll`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await handleResponse(response);
  return result.result?.map(mapSubCategoryToCategory) || [];
};

// Xóa danh mục con
export const deleteSubCategory = async (subCategoryId: string) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/subCategory/delete/${subCategoryId}`, {
    method: 'DELETE',
  });
  const result = await handleResponse(response);
  return result;
};

