import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAnimals = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/animals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(response.status);

      const data = await response.json();
      setAnimals(Array.isArray(data) ? data : data.animals || data.data || []);
    } catch (error) {
      if (error.message === "401" || error.message === "403") {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
      console.error("Fetch error:", error);
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete this animal?")) return;
      try {
        const token = localStorage.getItem("token");
        await fetch(`/api/animals/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAnimals();
      } catch (error) {
        console.error("Delete error:", error);
      }
    },
    [fetchAnimals],
  );

  return {
    animals,
    isLoading,
    refetch: fetchAnimals,
    deleteAnimal: handleDelete,
  };
};
