import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
