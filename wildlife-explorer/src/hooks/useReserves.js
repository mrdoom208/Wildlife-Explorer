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
        console.log("Deleted reserve with ID:", id);
        fetchReserves();
      } catch (error) {
        console.error("Delete reserve error:", error);
        console.error("ID", id);
      }
    },
    [fetchReserves],
  );

  const updateReserve = useCallback(
    async (id, updateData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/admin/reserves/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );

        if (!response.ok) throw new Error(response.status);

        // Refetch to get updated data
        fetchReserves();
        return true;
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          navigate("/admin/login");
        }
        console.error("Update reserve error:", error);
        return false;
      }
    },
    [fetchReserves, navigate],
  );

  const createReserve = useCallback(
    async (newReserveData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/admin/reserves",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newReserveData),
          },
        );

        if (!response.ok) throw new Error(response.status);

        fetchReserves(); // Refetch to show new reserve
        return true;
      } catch (error) {
        if (error.message === "401" || error.message === "403") {
          localStorage.removeItem("token");
          navigate("/admin/login");
        }
        console.error("Create reserve error:", error);
        return false;
      }
    },
    [fetchReserves, navigate],
  );

  return {
    reserves,
    isLoading,
    refetch: fetchReserves,
    deleteReserve: handleDelete,
    updateReserve,
    createReserve,
  };
};
