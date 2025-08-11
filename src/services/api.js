const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('ze_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('ze_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('ze_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(userData) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(userData) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  // Restaurant endpoints
  async getRestaurants(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/restaurants?${params}`);
  }

  async getRestaurant(id) {
    return this.request(`/restaurants/${id}`);
  }

  async createRestaurant(restaurantData) {
    return this.request('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  }

  // Dishes endpoints
  async getDishes(restaurantId) {
    return this.request(`/dishes?restaurantId=${restaurantId}`);
  }

  async getDish(id) {
    return this.request(`/dishes/${id}`);
  }

  async createDish(dishData) {
    return this.request('/dishes', {
      method: 'POST',
      body: JSON.stringify(dishData),
    });
  }

  // Enhanced restaurant endpoint with dishes
  async getRestaurantWithMenu(id) {
    try {
      const [restaurant, dishes] = await Promise.all([
        this.getRestaurant(id),
        this.getDishes(id)
      ]);
      return {
        ...restaurant,
        dishes: dishes || []
      };
    } catch (error) {
      console.error('Failed to fetch restaurant with menu:', error);
      throw error;
    }
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(itemData) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ qty: quantity }),
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/items', {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async getMyOrders() {
    return this.request('/orders/mine');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Payment endpoints
  async createPaymentIntent(total) {
    return this.request('/payments/intent', {
      method: 'POST',
      body: JSON.stringify({ total }),
    });
  }
}

export default new ApiService();
