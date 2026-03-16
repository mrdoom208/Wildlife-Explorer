import { useState } from "react";

export const useNewsletter = () => {
  const API_URL = import.meta.env.VITE_API_URL || ""; // <-- Added
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const subscribe = async (email, name = "") => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        // <-- Use API_URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setMessage(data.message || "Successfully subscribed!");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, message, error, setMessage, setError };
};
