const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const apiRequest = async (endpoint, method = "GET", body) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      const message = errorText || response.statusText || "API request failed";
      throw new Error(`API request failed: ${response.status} ${message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};