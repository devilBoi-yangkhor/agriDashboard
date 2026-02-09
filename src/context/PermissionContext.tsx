"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface PermissionContextType {
  permissions: string[];
  roles: string[];
  setPermissions: (permissions: string[]) => void;
  setRoles: (roles: string[]) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    // Load permissions and roles from localStorage on mount
    const storedPermissions = localStorage.getItem("permissions");
    const storedUser = localStorage.getItem("userDetails");


    try {
      if (storedPermissions) {
        setPermissions(JSON.parse(storedPermissions));
      }
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const { roles } = parsedUser
        if (Array.isArray(roles)) {
          const { permissions } = roles[0]
          setRoles(permissions);
        } else {
          console.error("Stored roles are not in the expected array format.");
        }
      }
    } catch (error) {
      console.error("Error parsing roles or permissions from localStorage:", error);
    }
  }, []);

  const updatePermissions = (newPermissions: string[]) => {
    setPermissions(newPermissions);
    localStorage.setItem("permissions", JSON.stringify(newPermissions));
  };

  const updateRoles = (newRoles: string[]) => {
    setRoles(newRoles);
    localStorage.setItem("roles", JSON.stringify(newRoles));
  };

  return (
    <PermissionContext.Provider value={{ 
      permissions, 
      roles,
      setPermissions: updatePermissions,
      setRoles: updateRoles
    }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

// Component to check role
export const HasRole = ({
  roles,
  hasRoles,
  children,
}: {
  roles: string | string[];
  hasRoles: string | string[];
  children: ReactNode;
}) => {
// console.log(Array.isArray(hasRoles),hasRoles, Array.isArray(roles),roles)
  return Array.isArray(hasRoles) && Array.isArray(roles) && roles.some(role => hasRoles.includes(role)) ? <>{children}</> : null;
};

export const HasPermission = ({
  permissions,
  hasPermissions,
  children,
}: {
  permissions?: string | string[];
  hasPermissions: string | string[];
  children: ReactNode;
}) => {
  const storedUser = localStorage.getItem("userDetails");
  if (storedUser && permissions === undefined) {
      const parsedUser = JSON.parse(storedUser);
      const { roles } = parsedUser
        if (Array.isArray(roles)) {
          const { permissions } = roles[0]
          return Array.isArray(permissions) && Array.isArray(permissions) && permissions.some(permission => hasPermissions.includes(permission)) ? <>{children}</> : null;
        }
    }else{
      return Array.isArray(permissions) && Array.isArray(permissions) && permissions.some(permission => hasPermissions.includes(permission)) ? <>{children}</> : null;
    }
};
