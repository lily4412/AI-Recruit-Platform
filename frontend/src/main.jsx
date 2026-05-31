import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { store } from "./store/store.js";
import "./assets/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#1e1810",
            border: "1px solid #ddd7c8",
            borderRadius: "10px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "13.5px",
            boxShadow: "0 8px 24px rgba(30,24,16,0.12)",
          },
          success: { iconTheme: { primary: "#2d7a4f", secondary: "#ffffff" } },
          error:   { iconTheme: { primary: "#c0392b", secondary: "#ffffff" } },
        }}
      />
    </Provider>
  </React.StrictMode>
);
