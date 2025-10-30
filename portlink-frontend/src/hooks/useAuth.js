import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginRequest, fetchCurrentUser, persistToken, clearToken } from '../api/authService';
import { setUser, setToken, clearAuth } from '../store/slices/authSlice';
import { getStoredToken } from '../lib/authStorage';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const loadUser = useCallback(async () => {
    const activeToken = token || getStoredToken();
    if (!activeToken) {
      dispatch(clearAuth());
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchCurrentUser();
      dispatch(setUser(data.user ?? data));
    } catch (error) {
      clearToken();
      dispatch(clearAuth());
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [dispatch, token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const { remember, ...payload } = credentials;
        const data = await loginRequest(payload);
        if (data?.access_token) {
          persistToken(data.access_token, remember ?? true);
          dispatch(setToken(data.access_token));
          await loadUser();
        }
        return data;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, loadUser],
  );

  const logout = useCallback(() => {
    clearToken();
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    user,
    token,
    loading,
    initialized,
    login,
    logout,
    reload: loadUser,
  };
}
