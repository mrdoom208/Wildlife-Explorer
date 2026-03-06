import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useMapIcons = () => {
  const [mapicons, setMapIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const LOGIN_PATH = "/login"; // ✅ Consistent path

  const server = "";

  const fetchMapIcons = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${server}/api/mapIcon`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setMapIcons(
        Array.isArray(data) ? data : data.mapIcons || data.data || [],
      );
    } catch (error) {
      handleAuthError(error);
      console.error("Fetch mapicons error:", error);
      setMapIcons([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // ✅ Shared auth error handler
  const handleAuthError = useCallback(
    (error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        localStorage.clear(); // Clear all auth data
        navigate(LOGIN_PATH, { replace: true });
      }
    },
    [navigate],
  );

  useEffect(() => {
    fetchMapIcons();
  }, [fetchMapIcons]);

  // ✅ Generic CRUD helper
  const apiRequest = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }, []);

  const createMapIcon = useCallback(
    async (iconData) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        await apiRequest(`${server}/api/mapIcon`, {
          method: "POST",
          body: JSON.stringify(iconData),
        });
        await fetchMapIcons();
      } catch (error) {
        handleAuthError(error);
        console.error("Create mapicon error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, fetchMapIcons, handleAuthError],
  );

  const updateMapIcon = useCallback(
  async (id, iconData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await apiRequest(`${server}/api/mapIcon/${id}`, {
        method: "PUT",
        body: JSON.stringify(iconData),
      });
      await fetchMapIcons(); // refresh after update
    } catch (error) {
      handleAuthError(error);
      console.error("Update mapicon error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  },
  [apiRequest, fetchMapIcons, handleAuthError],
);

  const deleteMapIcon = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        await apiRequest(`${server}/api/mapIcon/${id}`, {
          method: "DELETE",
        });
        await fetchMapIcons();
      } catch (error) {
        handleAuthError(error);
        console.error("Delete mapicon error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, fetchMapIcons, handleAuthError],
  );

  return {
    mapicons,
    isLoading,
    refetch: fetchMapIcons,
    createMapIcon,
    updateMapIcon,
    deleteMapIcon,
  };
};
