const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

export const auth = {
  register: (email: string, password: string, userType: 'cliente' | 'farmacia') =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, user_type: userType }),
    }),
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export const users = {
  getProfile: () => apiCall('/users/profile'),
  updateProfile: (data: any) =>
    apiCall('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export const medications = {
  list: (pharmacyId?: number) =>
    apiCall(`/medications${pharmacyId ? `?pharmacy_id=${pharmacyId}` : ''}`),
  searchByPharmacy: (query: string, pharmacyId: number) =>
    apiCall(`/medications/search?q=${query}&pharmacy_id=${pharmacyId}`),
  getAvailability: (medicationId: number) =>
    apiCall(`/medications/${medicationId}/availability`),
};

export const pharmacies = {
  list: () => apiCall('/pharmacies'),
  getById: (id: number) => apiCall(`/pharmacies/${id}`),
  getNearby: (latitude: number, longitude: number) =>
    apiCall(`/pharmacies/nearby?lat=${latitude}&lon=${longitude}`),
};

export const stock = {
  update: (pharmacyId: number, medicationId: number, quantity: number) =>
    apiCall(`/stock/${pharmacyId}/${medicationId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
};

export const orders = {
  create: (data: any) =>
    apiCall('/orders', { method: 'POST', body: JSON.stringify(data) }),
  list: () => apiCall('/orders'),
  getById: (id: number) => apiCall(`/orders/${id}`),
  updateStatus: (id: number, status: string) =>
    apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

export const recipes = {
  upload: (file: File, medicationIds: number[]) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('medication_ids', JSON.stringify(medicationIds));
    return fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    }).then(r => r.json());
  },
};
