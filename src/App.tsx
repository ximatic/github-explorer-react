import { BrowserRouter, Routes, Route } from "react-router-dom";

import { PrimeReactProvider } from "primereact/api";

import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";

import "./App.scss";

function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
