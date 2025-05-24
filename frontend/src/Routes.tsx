import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import RegisterTrainer from './pages/Register/Register-trainer/RegisterTrainer';
import RegisterStudent from './pages/Register/Register-student/RegisterStudent';
import TrainerLogin from './pages/Login/TrainerLogin/TrainerLogin';
import MyAccount from './pages/MyAccount/MyAccount';
import EditProfile from './pages/MyAccount/EditProfile/EditProfile';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/register-student" element={<RegisterStudent/>}/>
        <Route path="/register-trainer" element={<RegisterTrainer/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/login-trainer" element={<TrainerLogin/>}/>
        <Route path="/my-account" element={<MyAccount/>}/>
        <Route path="/my-account/edit" element={<EditProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}
