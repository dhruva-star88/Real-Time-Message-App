import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../../store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { addUser, loginUser } from '../../api/UserRequest'; // Import the API functions
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login logic
      try {
        const response = await loginUser(formData.email, formData.password);
        if (response.status === 200) {
          // Assuming the backend returns a JWT token
          const { token, user } = response.data;
          localStorage.setItem('token', token);  // Save the token in localStorage (or sessionStorage)
          dispatch(setSelectedUser(user));
          toast.success('Login successful!');
          setTimeout(() => {
            navigate('/message-area'); // Navigate to the message area
          }, 2000);// Navigate to the message area
        }
      } catch (error) {
        console.error(error);
        toast.error('Error during login. Please try again.');
      }
    } else {
      // Signup logic
      if (formData.password === formData.confirmPassword) {
        try {
          const response = await addUser(formData.username, formData.email, formData.password);
          if (response.status === 201) {
            dispatch(setSelectedUser({ username: formData.username, email: formData.email }));
            toast.success('Signup successful!');
            setTimeout(() => {
              navigate('/message-area'); // Navigate to the message area
            }, 2000); // Navigate to the message area
          }
        } catch (error) {
          console.error(error);
          toast.error('Error during signup. Please try again.');
        }
      } else {
        toast.error('Passwords do not match!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Signup'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-md pr-10"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer"
            >
              {passwordVisible ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
            </span>
          </div>
          {!isLogin && (
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded-md pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer"
              >
                {confirmPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20}/>}
              </span>
            </div>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
