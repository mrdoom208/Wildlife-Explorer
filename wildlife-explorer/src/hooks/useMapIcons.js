import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useMapIcons = () => {
  const [mapicons, setMapIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMapIcons = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/mapIcon", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(response.status);

      const data = await response.json();

      setMapIcons(
        Array.isArray(data) ? data : data.mapIcons || data.data || [],
      );
    } catch (error) {
      if (error.message === "401" || error.message === "403") {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }

      console.error("Fetch mapicons error:", error);
      setMapIcons([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMapIcons();
  }, [fetchMapIcons]);

  // ✅ CREATE functionality
  const createMapIcon = useCallback(
    async (iconData) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/admin/mapIcon",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(iconData),
          },
        );

        if (!response.ok) throw new Error(response.status);

        // Refetch the list to include new icon
        await fetchMapIcons();
        return await response.json();
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        console.error("Create mapicon error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMapIcons, navigate],
  );

  // ✅ UPDATE functionality
  const updateMapIcon = useCallback(
    async (id, iconData) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/admin/mapIcon/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(iconData),
          },
        );

        if (!response.ok) throw new Error(response.status);

        // Refetch the list to show updated icon
        await fetchMapIcons();
        return await response.json();
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        console.error("Update mapicon error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMapIcons, navigate],
  );

  const handleDelete = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:5000/api/admin/mapIcon/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchMapIcons();
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          navigate("/login");
        }
        console.error("Delete mapicon error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMapIcons, navigate],
  );

  return {
    mapicons,
    isLoading,
    refetch: fetchMapIcons,
    createMapIcon, // ✅ New
    updateMapIcon, // ✅ New
    deleteMapIcon: handleDelete,
  };
};
