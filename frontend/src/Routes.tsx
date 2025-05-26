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
import ChangePassword from './pages/MyAccount/ChangePassword/ChangePassword';
import Trainings from './pages/MyAccount/Trainings/Trainings';
import StudentLogin from './pages/Login/StudentLogin/StudentLogin';

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
        <Route path="/my-account-trainer" element={<MyAccount/>}/>
        <Route path="/my-account-trainer/edit" element={<EditProfile/>}/>
        <Route path="/my-account-trainer/change-password" element={<ChangePassword/>}/>
        <Route path="/my-account-trainer/trainings" element={<Trainings/>}/>
        <Route path="/my-account-student" element={<MyAccount/>}/>
        <Route path="/my-account-student/edit" element={<EditProfile/>}/>
        <Route path="/my-account-student/change-password" element={<ChangePassword/>}/>
        <Route path="/my-account-student/trainings" element={<Trainings/>}/>
        <Route path="/login-student" element={<StudentLogin/>}/>
      </Routes>
    </BrowserRouter>
  );
}
