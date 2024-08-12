
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RealTimeCamera from "./features/AllergenDetection/RealTimeCamera";
import CapturedPicture from "./features/AllergenDetection/CapturePicture";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RealTimeCamera />} />
        <Route path="/captured-picture" element={<CapturedPicture />} />
      </Routes>
    </Router>
  );
};

export default App;

