import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("ze_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ze_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ze_user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      location, 
      setLocation 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

// Export UserContext directly for components that need it
export { UserContext };
