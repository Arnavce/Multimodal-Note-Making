
import './App.css'

import { Canvas } from "./pages/Canvas"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MarkdownEditor from "./pages/TextEditor"
import { Dashboard } from "./pages/Dashboard"
import  Signin  from "./pages/Signin"
import  DrawPage  from "./pages/CSSCanvas"
import Signup from './pages/Signup'
import ExcalidrawExample from './pages/excali'


function App() {
  return <BrowserRouter>
    <Routes>

      <Route path="/canvas/:documentid?" element={<Canvas />} />
      <Route path="/texteditor/:documentid?" element={<MarkdownEditor />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/csscanvas" element={<DrawPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/excali" element={<ExcalidrawExample/>} />


    </Routes>

  </BrowserRouter>


}

export default App





