import { useForm } from 'react-hook-form';
import { faEye, faLock, faUserTie, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReCAPTCHA from 'react-google-recaptcha';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';

type LoginFormInputs = {
  username: string;
  password: string;
};

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    if (!captchaToken) {
      setCaptchaError('Please verify that you are not a robot.');
      return;
    }
  
    try {
      setAuthError('');
      setCaptchaError('');
      setLoading(true);
  
      const response = await axios.post(
        'http://localhost:8000/auth/login',
        {
          ...data,
          captchaToken,
        },
        {
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
  
        localStorage.setItem('token', token);
  
        const userId = user.id;
  
        try {
          await axios.get(`http://localhost:8000/trainers/${userId}`);
          navigate('/login-trainer');
        } catch (trainerError) {
          try {
            await axios.get(`http://localhost:8000/students/${userId}`);
            navigate('/login-student');
          } catch (studentError) {
            setAuthError('Unable to determine user role.');
          }
        }
      }
    } catch (err) {
      setAuthError('Wrong username or password');
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) setCaptchaError('');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 font-montserrat my-10">
      <div className={loading ? 'blur-sm pointer-events-none' : ''}>
        <h2 className="text-2xl font-bold mb-1 text-center">Sign In</h2>
        <p className="text-gray-500 mb-3 text-center">Welcome back</p>

        <form className="w-full max-w-xs" onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm mb-1 font-bold text-gray-700">Username</label>
          <div className={`flex items-center border rounded-md mb-3 px-3 py-1 ${errors.username ? 'border-red-500 bg-red-50' : 'bg-gray-100'}`}>
            <span className={`mr-2 ${errors.username ? 'text-red-500' : 'text-gray-500'}`}>
              <FontAwesomeIcon icon={faUserTie} />
            </span>
            <Input
              type="text"
              placeholder="Enter username"
              {...register('username', { required: true })}
              disabled={loading}
              className='border border-transparent'
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm mb-3">Username is required</p>}

          <label className="block text-sm mb-1 font-bold text-gray-700">Password</label>
          <div className={`flex items-center border rounded-md mb-5 px-3 py-1 ${errors.password ? 'border-red-500 bg-red-50' : 'bg-gray-100'}`}>
            <span className={`mr-2 ${errors.password ? 'text-red-500' : 'text-gray-500'}`}>
              <FontAwesomeIcon icon={faLock} />
            </span>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              {...register('password', { required: true })}
              disabled={loading}
              className='border border-transparent'
            />
            <Button
              onClick={() => setShowPassword(!showPassword)}
              variant="icon"
              type="button"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mb-3">Password is required</p>}

          {authError && <p className="text-red-500 text-sm mb-3">{authError}</p>}

          <div className="my-7 flex justify-center flex-col items-center">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITE_KEY || ''}
              onChange={onCaptchaChange}
            />
            {captchaError && <p className="text-red-500 text-sm mt-2">{captchaError}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full mb-5 bg-purple-600 text-white hover:bg-purple-700" disabled={loading}>
            Sign In
          </Button>

          <div className="text-center text-sm font-bold text-gray-700 mb-4 uppercase">or</div>

          <p className="text-center text-sm font-medium">
            Don’t have an account?{' '}
            <a href="/register" className="font-semibold text-purple-700 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm z-50">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="4x"
            className="text-purple-700"
          />
        </div>
      )}
    </div>
  );
}




export default LoginForm;
