
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RealTimeCamera from "./features/AllergenDetection/RealTimeCamera";
import CapturedPicture from "./features/AllergenDetection/CapturePicture";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import About from './components/About/About';
import UserProfile from "./components/Profile/UserProfile";
import ProtectedRoute from "./components/Routes/ProtectedRoute";

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
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/realtime-camera" element={<RealTimeCamera />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

