
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RealTimeCamera from "./features/AllergenDetection/RealTimeCamera";
import CapturedPicture from "./features/AllergenDetection/CapturePicture";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import About from './components/About/About';
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/captured-picture" element={<CapturedPicture />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/realtime-camera" element={<RealTimeCamera />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

