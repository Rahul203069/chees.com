
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./Home";
import Sign from "./Sign";
import  { Toaster } from 'react-hot-toast';
import Game from "./Game";
function App() {

  return (
    <>
        <Toaster>
        </Toaster>
      <BrowserRouter>
      <Routes>
       
          <Route path="/" element={<Home />} />
          <Route path="/Game" element={<Game />} />
          <Route path="/Sign" element={<Sign />} />


      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
