import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import Clients from "./pages/Clients";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import Instructors from "./pages/Instructors";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/groups" element={<Groups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
