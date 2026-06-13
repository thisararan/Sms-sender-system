// Test script to verify frontend is working
// Paste this in browser console (F12) and run

console.log("=== FRONTEND DIAGNOSTIC ===");
console.log("URL:", window.location.href);
console.log("Pathname:", window.location.pathname);
console.log("Auth State:", localStorage.getItem("isAuthenticated"));
console.log("Root Element:", document.getElementById("root"));
console.log(
  "Root Content:",
  document.getElementById("root")?.innerHTML?.substring(0, 100)
);

// Check if React is loaded
console.log("React Components Loaded:", !!window.React);

// Test navigation
console.log("Testing navigation to /login...");
window.location.href = "http://localhost:5173/login";
