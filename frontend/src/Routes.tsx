import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import RegisterTrainer from './pages/Register-trainer/RegisterTrainer';
import RegisterStudent from './pages/Register-student/RegisterStudent';

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
      </Routes>
    </BrowserRouter>
  );
}
