import HomePage from "@/pages/Home"
import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login"


function App() {

  return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

        </Routes>
      </div>

  )
}

export default App
