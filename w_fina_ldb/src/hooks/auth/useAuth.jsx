/**
 * Authentication Hook
 * Provides authentication state and methods
 */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '@/api';
import { ROUTES, EMPLOYEE_ROLES } from '@/config/constants';

const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Wraps the application to provide auth context
 */
export const AuthProvider = ({ children, navigateRef }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const employee = authAPI.getEmployee();
    const token = authAPI.getToken();

    if (employee && token) {
      setUser(employee);
    }
    setLoading(false);
  }, []);

  /**
   * Login with credentials
   */
  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, employee } = response.data.data;

      // Store auth data
      authAPI.setAuthData(token, employee);
      setUser(employee);

      // Navigate based on role
      const roleRoutes = {
        [EMPLOYEE_ROLES.VERIFIER]: ROUTES.VERIFIER_CHECK,
        [EMPLOYEE_ROLES.DATA_ENTRY]: ROUTES.DATA_ENTRY_APPLICANTS,
        [EMPLOYEE_ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
        [EMPLOYEE_ROLES.RECEIVER]: ROUTES.VERIFIER_RECEIVED,
      };

      navigateRef.current?.(roleRoutes[employee.role] || ROUTES.LOGIN);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Logout and clear session
   */
  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    navigateRef.current?.(ROUTES.LOGIN);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Update user data
   */
  const updateUser = useCallback((updates) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('employee', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  /**
   * Check if user has specific role(s)
   */
  const hasRole = useCallback((roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  }, [user]);

  /**
   * Check if user has any of the specified permissions
   */
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    // Admin has all permissions
    if (user.role === EMPLOYEE_ROLES.ADMIN) return true;
    // Define role-based permissions
    const rolePermissions = {
      [EMPLOYEE_ROLES.VERIFIER]: ['check', 'reject', 'view_log'],
      [EMPLOYEE_ROLES.DATA_ENTRY]: ['create', 'edit', 'upload'],
      [EMPLOYEE_ROLES.RECEIVER]: ['receive', 'issue'],
    };
    return rolePermissions[user.role]?.includes(permission) || false;
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    hasPermission,
    isAuthenticated: !!user,
  }), [user, loading, login, logout, updateUser, hasRole, hasPermission]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Usage: const { user, login, logout, hasRole } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
