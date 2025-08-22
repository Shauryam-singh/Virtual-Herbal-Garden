import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Garden from "./pages/Garden";
import Disease from "./pages/Disease";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QuizPage from "./pages/QuizPage";
import PlantDetails from "./pages/PlantDetails";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/disease" element={<Disease />} />
        <Route path="/quiz" element={<QuizPage />} /> 
        <Route path="/plants/:id" element={<PlantDetails />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
