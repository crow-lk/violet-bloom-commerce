import { GoogleOAuthProvider } from "@react-oauth/google";
import { initializeFacebook } from "@/lib/facebook";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

initializeFacebook();

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  >
    <App />
  </GoogleOAuthProvider>
);