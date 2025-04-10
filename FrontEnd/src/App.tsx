
import './App.css'

import { Canvas } from "./pages/Canvas"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MarkdownEditor from "./pages/TextEditor"
import { Dashboard } from "./pages/Dashboard"
import { Signin } from "./pages/Signin"
import  DrawPage  from "./pages/CSSCanvas"


function App() {
  return <BrowserRouter>
    <Routes>

      <Route path="/canvas/:documentid?" element={<Canvas />} />
      <Route path="/texteditor/:documentid?" element={<MarkdownEditor />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/csscanvas" element={<DrawPage />} />
      
    </Routes>

  </BrowserRouter>


}

export default App





