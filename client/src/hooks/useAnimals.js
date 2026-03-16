import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useAnimals = () => {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all animals
  const fetchAnimals = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/animals`, {
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

  // Delete an animal
  const deleteAnimal = useCallback(
    async (id) => {
      if (!window.confirm("Delete this animal?")) return;
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/api/animals/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAnimals(); // refetch after deletion
      } catch (error) {
        console.error("Delete error:", error);
      }
    },
    [fetchAnimals],
  );

  // Create or update animal
  const updateAnimal = useCallback(
    async (formDataToSubmit, editingId= null) => {
      try {
        const token = localStorage.getItem("token");
        const url = editingId
          ? `${API_URL}/api/admin/animals/${editingId}`
          : `${API_URL}/api/admin/animals`;

        const response = await fetch(url, {
          method: editingId ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSubmit),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Request failed");
        }

        fetchAnimals(); 
        return data;
      } catch (error) {
        console.error("Update error:", error);
        throw error;
      }
    },
    [fetchAnimals],
  );

  // Initial fetch
  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  return {
    animals,
    isLoading,
    refetch: fetchAnimals,
    deleteAnimal,
    updateAnimal, // renamed from submitAnimal
  };
};