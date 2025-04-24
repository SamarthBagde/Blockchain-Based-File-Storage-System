import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AddFileForm from "./components/addFileForm";
import FetchFile from "./components/fetchFile";
import AllMyFiles from "./components/allMyFiles";
import { WalletProvider } from "./utiles/WalletProvider";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AllMyFiles />} />
          <Route path="/upload" element={<AddFileForm />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
