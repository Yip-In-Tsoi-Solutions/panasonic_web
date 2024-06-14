import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import App from "./pages/main_app/App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/components";
import LoginError from "./error_pages/login_error";
import NotFoundError from "./error_pages/error_not_found";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div>loadding ...</div>}>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />}/>
          <Route path="/home" element={<App />} />
          <Route path="/error_login" element={<LoginError />} />
          <Route path="/error_not_found" element={<NotFoundError />} />
        </Routes>
      </Router>
    </Provider>
    </Suspense>
  </React.StrictMode>
);
