import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store"; // Ensure you create this file
import App from "./App.jsx";
import "./index.css"; // This holds your Tailwind CSS imports

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider gives every component access to your global state */}
    <Provider store={store}>
      {/* BrowserRouter enables routing between your different views */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
