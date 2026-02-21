// Mock API for your presentation
export const authApi = {
  login: async (email, password) => {
    if (!password) throw new Error("Password is required");
    
    console.log(`Login attempt for: ${email}`);
    
    return {
      data: {
        token: "fake-jwt-token",
        user: { 
          id: "1", 
          email: email, 
          role: "designer", 
          businessName: "Fashion Link Pro" 
        }
      }
    };
  },

  signup: async (email, password, role) => {
    // We 'read' all values here
    const newUser = { email, password, role };
    console.log("Saving new user to mock database:", newUser.email);
    
    return { 
      data: { 
        message: "User created successfully"
      } 
    };
  },

  me: async () => {
    return {
      data: {
        user: { id: "1", email: "ediuana@fashionlink.com", role: "designer" }
      }
    };
  }
};

export const orderApi = {
  getAll: async () => ({ data: [] }),
  getById: async (id) => ({ data: { id, status: 'in_progress', measurements: {} } }),
  updateStatus: async (id, status) => ({ data: { id, status } })
};