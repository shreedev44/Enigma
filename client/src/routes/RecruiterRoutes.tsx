import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '@/components/recruiterComponents/Navbar';
import SignIn from '@/pages/recruiter/SignIn';
import Signup from '@/pages/recruiter/Signup';
import Home from '@/pages/recruiter/Home';


const RecruiterRoutes = () => {
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

export default RecruiterRoutes
