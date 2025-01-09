import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from '@/pages/student/SignIn';
import Signup from '@/pages/student/Signup';
import Home from '@/pages/student/Home';
import Navbar from '@/components/studentComponents/Navbar';


const StudentRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<SignIn />}/>
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/signup' element={<Signup />}/>
      </Routes>
    </>
  )
}

export default StudentRoutes
