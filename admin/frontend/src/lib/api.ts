const API_BASE_URL = "http://localhost:3002";

// Token management
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("auth_token");
}

// API fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ data: { token: string; admin: User } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<{ data: { token: string; user: User } }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => apiFetch<User>("/api/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// Products API
export const productsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    collection_id?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.collection_id)
      searchParams.set("collection_id", params.collection_id);
    const query = searchParams.toString();
    return apiFetch<{
      data: Product[];
      total: number;
      page: number;
      limit: number;
    }>(`/api/admin/products${query ? `?${query}` : ""}`);
  },

  get: (id: string) => apiFetch<Product>(`/api/admin/products/${id}`),

  create: (data: CreateProductData) =>
    apiFetch<Product>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateProductData>) =>
    apiFetch<Product>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiFetch<Product>(`/api/admin/products/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiFetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    }),
};

// Collections API
export const collectionsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    const query = searchParams.toString();
    return apiFetch<{
      data: Collection[];
      total: number;
      page: number;
      limit: number;
    }>(`/api/admin/collections${query ? `?${query}` : ""}`);
  },

  get: (id: string) => apiFetch<{
    data: Collection;
  }>(`/api/admin/collections/${id}`),

  getActive: () => apiFetch<Collection | null>("/api/admin/collections/active"),

  create: (data: CreateCollectionData) =>
    apiFetch<Collection>("/api/admin/collections", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateCollectionData>) =>
    apiFetch<Collection>(`/api/admin/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  toggle: (id: string) =>
    apiFetch<{
      data: Collection;
    }>(`/api/admin/collections/${id}/toggle`, {
      method: "PATCH",
    }),

  delete: (id: string) =>
    apiFetch(`/api/admin/collections/${id}`, {
      method: "DELETE",
    }),
};

// Orders API
export const ordersApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    const query = searchParams.toString();
    return apiFetch<{
      data: Order[];
      total: number;
      page: number;
      limit: number;
    }>(`/api/admin/orders${query ? `?${query}` : ""}`);
  },

  get: (id: string) => apiFetch<{
    data: Order;
  }>(`/api/admin/orders/${id}`),

  updateStatus: (id: string, status: string) =>
    apiFetch<Order>(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// Deliveries API
export const deliveriesApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    const query = searchParams.toString();
    return apiFetch<{
      data: Delivery[];
      total: number;
      page: number;
      limit: number;
    }>(`/api/admin/deliveries${query ? `?${query}` : ""}`);
  },

  get: (id: string) => apiFetch<{
    data: Delivery;
  }>(`/api/admin/deliveries/${id}`),

  updateStatus: (id: string, status: string) =>
    apiFetch<Delivery>(`/api/admin/deliveries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// Notifications API
export const notificationsApi = {
  list: (params?: { page?: number; limit?: number; unread?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.unread !== undefined)
      searchParams.set("unread", String(params.unread));
    const query = searchParams.toString();
    return apiFetch<{
      data: Notification[];
      total: number;
      unreadCount: number;
    }>(`/api/admin/notifications${query ? `?${query}` : ""}`);
  },

  markAsRead: (id: string) =>
    apiFetch(`/api/admin/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    apiFetch("/api/admin/notifications/read-all", {
      method: "PATCH",
    }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiFetch<DashboardStats>("/api/admin/dashboard/stats"),

  getRecentSales: () => apiFetch<Order[]>("/api/admin/dashboard/recent-sales"),
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  category: string;
  brand?: string;
  size?: string
  condition?: string;
  price?: number;
  original_price?: number;
  status: "draft" | "available" | "sold" | "archived";
  images?: string[];
  measurements?: Record<string, number>;
  collection_id?: string;
  collection?: Collection;
  created_at: string;
  updated_at: string;
  size_id?: string;
}

export interface CreateProductData {
  title: string;
  description?: string;
  category: string;
  brand?: string;
  size_id?: string;
  condition?: string;
  original_price?: number;
  price: number;
  status?: string;
  images?: string[];
  measurements?: Record<string, number>;
  collection_id?: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  products_count?: number;
  avaliable_count?: number;
  sold_count?: number;
  created_at: string;
  updated_at: string;
  launch_at?: string;
}

export interface CreateCollectionData {
  title: string;
  description?: string;
  is_active?: boolean;
  launch_at?: string;
  slug?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total: number;
  payment_method?: string;
  items: OrderItem[];
  address?: Address;
  created_at: string;
  updated_at: string;
  notes?: string;
  item_count?: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  order?: Order;
  status: "pending" | "scheduled" | "in_transit" | "delivered" | "failed";
  scheduled_date?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  type: "order" | "delivery" | "product" | "system";
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface DashboardStats {
  total_sales: number;
  total_orders: number;
  pending_deliveries: number;
  total_products: number;
  sales_this_month?: number;
  orders_this_month?: number;
}
