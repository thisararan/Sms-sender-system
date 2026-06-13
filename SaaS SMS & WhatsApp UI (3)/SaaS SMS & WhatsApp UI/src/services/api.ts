const API_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api";

export const api = {
  // Authentication
  auth: {
    login: (email: string, password: string) =>
      fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
          return r.text();
        })
        .then((text) => {
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error("Invalid JSON response:", text);
            throw new Error(
              "Server returned invalid response: " + text.substring(0, 100)
            );
          }
        }),
    register: (data: any) =>
      fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    logout: () =>
      fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((r) => r.json()),
    me: () => fetch(`${API_URL}/me`).then((r) => r.json()),
  },

  // Health check
  health: () => fetch(`${API_URL}/health`).then((r) => r.json()),

  // Contacts
  contacts: {
    list: () => fetch(`${API_URL}/contacts`).then((r) => r.json()),
    get: (id: number) =>
      fetch(`${API_URL}/contacts/${id}`).then((r) => r.json()),
    create: (data: any) =>
      fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: number, data: any) =>
      fetch(`${API_URL}/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: number) =>
      fetch(`${API_URL}/contacts/${id}`, { method: "DELETE" }).then((r) =>
        r.json()
      ),
  },

  // Dashboard
  dashboard: {
    stats: () => fetch(`${API_URL}/dashboard/stats`).then((r) => r.json()),
    charts: () => fetch(`${API_URL}/dashboard/charts`).then((r) => r.json()),
  },

  // Messages
  messages: {
    list: () => fetch(`${API_URL}/messages`).then((r) => r.json()),
    send: (data: any) =>
      fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },

  // Templates
  templates: {
    list: () => fetch(`${API_URL}/templates`).then((r) => r.json()),
    create: (data: any) =>
      fetch(`${API_URL}/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: number) =>
      fetch(`${API_URL}/templates/${id}`, { method: "DELETE" }).then((r) =>
        r.json()
      ),
  },
};
