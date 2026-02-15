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

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete this map icon?")) return;

      try {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:5000/api/admin/mapicons/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchMapIcons();
      } catch (error) {
        console.error("Delete mapicon error:", error);
      }
    },
    [fetchMapIcons],
  );

  return {
    mapicons,
    isLoading,
    refetch: fetchMapIcons,
    deleteMapIcon: handleDelete,
  };
};
