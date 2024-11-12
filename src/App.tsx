import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Etherspot, Home, Wagmi } from "@/pages";
import { IndividualFlow } from "./pages/IndividualFlow";
import { LegalFlow } from "./pages/LegalFlow";

function App() {
  return (
    <Router>
      <main className="flex flex-col justify-between">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aa" element={<Etherspot />} />
          <Route path="/wagmi" element={<Wagmi />} />
          <Route path="/individual" element={<IndividualFlow />} />
          <Route path="/legal" element={<LegalFlow />} />
        </Routes>
        <Toaster />
      </main>
    </Router>
  );
}

export default App;
