import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useReserves = () => {
  const [reserves, setReserves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReserves = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reserves", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(response.status);

      const data = await response.json();
      setReserves(
        Array.isArray(data) ? data : data.reserves || data.data || [],
      );
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
  }, [navigate]);

  useEffect(() => {
    fetchReserves();
  }, [fetchReserves]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete this reserve?")) return;
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/admin/reserves/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchReserves();
      } catch (error) {
        console.error("Delete reserve error:", error);
      }
    },
    [fetchReserves],
  );

  return {
    reserves,
    isLoading,
    refetch: fetchReserves,
    deleteReserve: handleDelete,
  };
};
