import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useReserves = () => {
  const API_URL = import.meta.env.VITE_API_URL; // <-- Added
  const [reserves, setReserves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all reserves
  const fetchReserves = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reserves`, { // <-- Use API_URL
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(response.status);

      const data = await response.json();
      setReserves(Array.isArray(data) ? data : data.reserves || data.data || []);
    } catch (error) {
      if (error.message === "401" || error.message === "403") {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
      console.error("Fetch reserves error:", error);
      setReserves([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, navigate]);

  useEffect(() => {
    fetchReserves();
  }, [fetchReserves]);

  // Delete a reserve
  const deleteReserve = useCallback(
    async (id) => {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/api/reserves/${id}`, { // <-- Use API_URL
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Deleted reserve with ID:", id);
        fetchReserves();
      } catch (error) {
        console.error("Delete reserve error:", error, "ID:", id);
      }
    },
    [API_URL, fetchReserves],
  );

  // Update a reserve
  const updateReserve = useCallback(
    async (id, updateData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/reserves/${id}`, { // <-- Use API_URL
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) throw new Error(response.status);

        fetchReserves(); // Refetch to get updated data
        return true;
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        console.error("Update reserve error:", error);
        return false;
      }
    },
    [API_URL, fetchReserves, navigate],
  );

  // Create a new reserve
  const createReserve = useCallback(
    async (newReserveData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/reserves`, { // <-- Use API_URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newReserveData),
        });

        if (!response.ok) throw new Error(response.status);

        fetchReserves(); // Refetch to show new reserve
        return true;
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        console.error("Create reserve error:", error);
        return false;
      }
    },
    [API_URL, fetchReserves, navigate],
  );

  return {
    reserves,
    isLoading,
    refetch: fetchReserves,
    deleteReserve,
    updateReserve,
    createReserve,
  };
};