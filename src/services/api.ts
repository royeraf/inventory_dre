const API_URL = import.meta.env.VITE_API_URL;

export async function apiPost(url: string, data: any) {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
