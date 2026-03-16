import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useNewsUpdates = () => {
  const API_URL = import.meta.env.VITE_API_URL; // <-- Added
  const [newsUpdates, setNewsUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all news updates
  const fetchNewsUpdates = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/news`, { // <-- Use API_URL
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(response.status);

      const data = await response.json();
      setNewsUpdates(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      if (error.message === "401" || error.message === "403") {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
      console.error("Fetch news updates error:", error);
      setNewsUpdates([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, navigate]);

  useEffect(() => {
    fetchNewsUpdates();
  }, [fetchNewsUpdates]);

  // Delete a news update
  const deleteNewsUpdate = useCallback(
    async (id) => {
      if (!window.confirm("Delete this news update?")) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/news/${id}`, { // <-- Use API_URL
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(response.status);

        fetchNewsUpdates();
      } catch (error) {
        console.error("Delete news update error:", error, "ID:", id);
      }
    },
    [API_URL, fetchNewsUpdates],
  );

  // Update a news update
  const updateNewsUpdate = useCallback(
    async (id, updateData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/news/${id}`, { // <-- Use API_URL
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) throw new Error(response.status);

        fetchNewsUpdates();
        return true;
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          navigate("/admin/login");
        }
        console.error("Update news update error:", error);
        return false;
      }
    },
    [API_URL, fetchNewsUpdates, navigate],
  );

  // Create a new news update
  const createNewsUpdate = useCallback(
    async (newData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/news`, { // <-- Use API_URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newData),
        });

        if (!response.ok) throw new Error(response.status);

        fetchNewsUpdates();
        return true;
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          navigate("/admin/login");
        }
        console.error("Create news update error:", error);
        return false;
      }
    },
    [API_URL, fetchNewsUpdates, navigate],
  );

  return {
    newsUpdates,
    isLoading,
    refetch: fetchNewsUpdates,
    deleteNewsUpdate,
    updateNewsUpdate,
    createNewsUpdate,
  };
};