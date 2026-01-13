// src/hooks/useAnimals.js - FIXED
import { useState, useEffect, useCallback } from 'react';

export const useAnimals = (initialAnimals = []) => {
  const [animals, setAnimals] = useState(initialAnimals);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Fetch from YOUR real API
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/animals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
            return;
          }
          throw new Error('Failed to fetch');
        }
        
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setAnimals(initialAnimals);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [initialAnimals]);

  // Keep your CRUD functions
  const updateAnimals = useCallback(async (updates) => {
    // Your existing update logic
  }, []);

  const addAnimal = useCallback(async (newAnimal) => {
    // Your existing add logic
  }, []);

  return { animals, loading, addAnimal, updateAnimals };
};
