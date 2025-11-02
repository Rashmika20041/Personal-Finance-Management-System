const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user');
    }

    return data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export const apiService = new ApiService();