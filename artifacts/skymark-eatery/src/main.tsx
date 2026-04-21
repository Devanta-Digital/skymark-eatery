import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/** Visual QA / Playwright snapshots: neutralize scroll + motion surprises. */
try {
  const q = new URLSearchParams(window.location.search);
  if (q.has("visualQa") || q.get("visualQa") === "1") {
    document.documentElement.dataset.visualQa = "1";
  }
} catch {
  /* non-browser */
}

createRoot(document.getElementById("root")!).render(<App />);
