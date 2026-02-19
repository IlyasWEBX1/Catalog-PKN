const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
  ? "http://127.0.0.1:8000" // Django local server
  : "https://ac4b58b1-3516-4786-9d16-45bac0c642a5-00-2d5hkcc95h3qq.pike.replit.dev";
