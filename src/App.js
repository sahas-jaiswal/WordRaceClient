import { Routes, Route } from "react-router-dom";
import Home from "./Containers/Home";
import Game from "./Containers/Game";
import './App.css'
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/>} />
        <Route path="/game" element={ <Game/>} />
      </Routes>
    </div>
  );
}

export default App;
