import { render } from "@wordpress/element";
import App from "./App";
import "../styles/admin.css";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("acsb-admin-root");

  if (root) {
    render(<App />, root);
  }
});
