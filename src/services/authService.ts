export interface User {
  id: string;
  name: string;
  role: "strategy" | "general";
  email: string;
}

export const authService = {
  login: async (role: "strategy" | "general"): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: role === "strategy" ? "user-strat-1" : "user-gen-1",
          name: role === "strategy" ? "Ashika Jain" : "John Doe",
          role: role,
          email: `${role}@example.com`,
        });
      }, 800);
    });
  },
  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  }
};
