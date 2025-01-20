import { ThemeProvider } from "./context/ThemeContext"
import { Routes, Route } from "react-router-dom"
import StudentRoutes from "./routes/StudentRoutes"
import AdminRoutes from "./routes/AdminRoutes"
import RecruiterRoutes from "./routes/RecruiterRoutes"
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <ThemeProvider>
      <Toaster />
      <Routes>
        <Route path="/*" element={<StudentRoutes />}/>
        <Route path="/admin/*" element={<AdminRoutes />}/>
        <Route path="/recruiter/*" element={<RecruiterRoutes />}/>
      </Routes>
    </ThemeProvider>
  )
}

export default App
