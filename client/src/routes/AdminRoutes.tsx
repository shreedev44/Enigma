import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '@/components/adminComponents/Navbar';
import SignIn from '@/pages/admin/SignIn';
import Dashboard from '@/pages/admin/Dashboard';


const AdminRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path='/login' element={<SignIn />}/>
        <Route path='/signin' element={<SignIn />}/>
      </Routes>
    </>
  )
}

export default AdminRoutes
