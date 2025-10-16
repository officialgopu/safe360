const API_BASE_URL = "http://127.0.0.1:8000";

export const api = {
  // Submit Alert (matches your AlertSubmissionForm)
  submitAlert: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/submit-alert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting alert:", error);
      throw error;
    }
  },

  // Get all Firebase alerts (for real-time display)
  getFirebaseAlerts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/alerts`);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return await response.json();
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  },

  // Get active Firebase alerts only
  getActiveAlerts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/alerts/active`);
      if (!response.ok) throw new Error("Failed to fetch active alerts");
      return await response.json();
    } catch (error) {
      console.error("Error fetching active alerts:", error);
      throw error;
    }
  },

  // Get PostgreSQL alerts (historical data)
  getAlerts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return await response.json();
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  },

  // Login
  loginUser: async (credentials: { username: string; password: string; role: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error("Login failed");
      return await response.json();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },
};