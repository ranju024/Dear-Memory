const API_BASE_URL = "http://localhost:8000/api";

// Store token in localStorage
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub;
  } catch {
    return null;
  }
};

// Generic API call helper
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    // headers.Authorization = `Bearer ${token}`;
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.href = "/login";
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "API Error");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// AUTH
export const authAPI = {
  register: (data: { email: string; username: string; password: string; full_name?: string }) =>
    apiCall("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => apiCall("/auth/me?token=" + getToken()),
};

// EVENTS
export const eventsAPI = {
  create: (data: any) =>
    apiCall("/events/?token=" + getToken(), {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (status?: string) => {
    const query = new URLSearchParams({ token: getToken() || "" });
    if (status) query.append("status_filter", status);
    return apiCall(`/events/?${query}`);
  },

  get: (id: number) => apiCall(`/events/${id}`),

  getBySlug: (slug: string) => apiCall(`/events/slug/${slug}`),

  update: (id: number, data: any) =>
    apiCall(`/events/${id}?token=${getToken()}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  publish: (id: number) => apiCall(`/events/${id}/publish?token=${getToken()}`, { method: "POST" }),
};

// PHOTOS
export const photosAPI = {
  upload: (eventId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = getToken();
    return fetch(`${API_BASE_URL}/photos/${eventId}/upload?token=${token}`, {
      method: "POST",
      body: formData,
    }).then((r) => r.json());
  },

  list: (eventId: number) => apiCall(`/photos/${eventId}`),

  get: (id: number) => apiCall(`/photos/photo/${id}`),

  update: (id: number, data: any) =>
    apiCall(`/photos/photo/${id}?token=${getToken()}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  favorite: (id: number) => apiCall(`/photos/photo/${id}/favorite`, { method: "POST" }),
  unfavorite: (id: number) => apiCall(`/photos/photo/${id}/unfavorite?token=${getToken()}`, { method: "POST" }),
  download: (id: number) => apiCall(`/photos/photo/${id}/download`, { method: "POST" }),

  delete: (id: number) =>
    apiCall(`/photos/photo/${id}?token=${getToken()}`, {
      method: "DELETE",
    }),
};

// ALBUMS
export const albumsAPI = {
  create: (eventId: number, data: any) =>
    apiCall(`/albums/${eventId}?token=${getToken()}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (eventId: number) => apiCall(`/albums/${eventId}`),

  get: (id: number) => apiCall(`/albums/album/${id}`),

  update: (id: number, data: any) =>
    apiCall(`/albums/album/${id}?token=${getToken()}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  addPhoto: (albumId: number, photoId: number) =>
    apiCall(`/albums/album/${albumId}/photos/${photoId}?token=${getToken()}`, { method: "POST" }),

  removePhoto: (albumId: number, photoId: number) =>
    apiCall(`/albums/album/${albumId}/photos/${photoId}?token=${getToken()}`, { method: "DELETE" }),
};

// LEADS
export const leadsAPI = {
  create: (data: any) =>
    apiCall(`/leads/?token=${getToken()}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (status?: string) => {
    const query = new URLSearchParams({ token: getToken() || "" });
    if (status) query.append("status_filter", status);
    return apiCall(`/leads/?${query}`);
  },

  get: (id: number) => apiCall(`/leads/${id}?token=${getToken()}`),

  update: (id: number, data: any) =>
    apiCall(`/leads/${id}?token=${getToken()}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: number, status: string) =>
    apiCall(`/leads/${id}/status/${status}?token=${getToken()}`, {
      method: "POST",
    }),
};

// ANALYTICS
export const analyticsAPI = {
  dashboard: (userId: number) => apiCall(`/analytics/dashboard/${userId}?token=${getToken()}`),

  eventTraffic: (userId: number) =>
    apiCall(`/analytics/events/${userId}/traffic?token=${getToken()}`),

  eventPerformance: (eventId: number) =>
    apiCall(`/analytics/event/${eventId}/performance?token=${getToken()}`),

  leadsFunnel: (userId: number) => apiCall(`/analytics/leads/${userId}/funnel?token=${getToken()}`),

  topPhotos: (userId: number) => apiCall(`/analytics/top-photos/${userId}?token=${getToken()}`),
};

// STUDIO
export const studioAPI = {
  create: (data: any) =>
    apiCall(`/studio/?token=${getToken()}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => apiCall(`/studio/me?token=${getToken()}`),

  getBySlug: (slug: string) => apiCall(`/studio/slug/${slug}`),

  update: (data: any) =>
    apiCall(`/studio/me?token=${getToken()}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
