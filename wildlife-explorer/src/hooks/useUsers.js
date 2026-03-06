import { useState, useCallback, useEffect } from "react";
import { usersApi } from "../services/api"; 

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET - Fetch all users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // CREATE - Add new user
  const createUser = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await usersApi.create(userData);
      setUsers((prev) => [...prev, newUser]); // Optimistically add to list
      return newUser;
    } catch (err) {
      setError(err.message);
      console.error("Error creating user:", err);
      throw err; // Re-throw for component to handle UI feedback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await usersApi.update(userId, userData);
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? updatedUser : user)),
      );
      return updatedUser;
    } catch (err) {
      setError(err.message);
      console.error("Error updating user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // DELETE - Remove user
  const deleteUser = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersApi.delete(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId)); // Optimistically remove
    } catch (err) {
      setError(err.message);
      console.error("Error deleting user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
    updateUser,
  };
};
